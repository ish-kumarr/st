import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Razorpay from 'razorpay';


const JWT_SECRET = process.env.JWT_SECRET || 'clinical_security_fallback';

async function getAuthenticatedUser(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return null;
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (err) {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const userId = await getAuthenticatedUser(req);
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const { productId, quantity, type, shippingAddress, paymentMethod, saveAddress } = await req.json(); // type: 'buy_now' or 'cart_checkout'

        const user = await User.findById(userId).populate('cart.product');
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        let orderItems = [];
        let totalAmount = 0;

        if (type === 'buy_now') {
            const product = await Product.findById(productId);
            if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

            if (product.stockCount < quantity) {
                return NextResponse.json({
                    success: false,
                    error: `Out of Stock: '${product.name}' is currently unavailable.`
                }, { status: 400 });
            }

            orderItems.push({
                product: productId,
                quantity,
                priceAtTime: product.price
            });
            totalAmount = product.price * quantity;

            // Decrement stock
            product.stockCount -= quantity;
            if (product.stockCount === 0) product.inStock = false;
            await product.save();
        } else {
            // Cart checkout
            if (user.cart.length === 0) {
                return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
            }

            for (const item of user.cart) {
                const product = item.product;
                if (product.stockCount < item.quantity) {
                    return NextResponse.json({
                        success: false,
                        error: `Out of Stock: '${product.name}' is temporarily unavailable.`
                    }, { status: 400 });
                }

                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    priceAtTime: product.price
                });
                totalAmount += product.price * item.quantity;

                // Decrement stock
                product.stockCount -= item.quantity;
                if (product.stockCount === 0) product.inStock = false;
                await product.save();
            }

            // Clear cart after checkout
            user.cart = [];
        }

        if (saveAddress && shippingAddress) {
            if (!user.savedAddresses) user.savedAddresses = [];
            user.savedAddresses.push(shippingAddress);
        }
        await user.save();

        const safeType = type === 'buy_now' ? 'buy_now' : 'standard';

        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,
            type: safeType,
            status: 'pending', // Pending real payment
            paymentMethod: paymentMethod || 'card',
            shippingAddress
        });

        if (paymentMethod === 'cod') {
            return NextResponse.json({
                success: true,
                message: 'Order placed via Cash on Delivery',
                orderId: order._id
            });
        }

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || ''
        });

        // Add 5% tax or calculate strictly (assuming totalAmount here is Subtotal. Let's send the final sum)
        const totalWithTax = totalAmount + (totalAmount * 0.05);

        const rzpOrder = await razorpay.orders.create({
            amount: Math.round(totalWithTax * 100), // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${order._id}`,
            notes: {
                userId: userId.toString(),
                mongoOrderId: order._id.toString()
            }
        });

        order.razorpayOrderId = rzpOrder.id;
        await order.save();

        return NextResponse.json({
            success: true,
            message: 'Transaction pending gateway',
            orderId: order._id,
            razorpayOrderId: rzpOrder.id,
            amount: rzpOrder.amount,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
        });

    } catch (error: any) {
        console.error('Checkout API Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
    }
}

