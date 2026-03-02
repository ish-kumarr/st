import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Razorpay from 'razorpay';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

// Configure Cashfree
const cashfree = new Cashfree(
    process.env.CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    process.env.CASHFREE_CLIENT_ID || '',
    process.env.CASHFREE_CLIENT_SECRET || ''
);
cashfree.XApiVersion = "2023-08-01"; // Using the stable version compatible with most accounts



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

        const { productId, quantity, type, shippingAddress, paymentMethod, saveAddress, currency } = await req.json(); // type: 'buy_now' or 'cart_checkout'

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

            totalAmount = product.price * quantity;
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

                totalAmount += product.price * item.quantity;
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

        const CONVERSION_RATES: Record<string, number> = {
            INR: 1,
            USD: 0.012,
            EUR: 0.011,
            GBP: 0.0094,
            JPY: 1.81,
        };

        const rzpCurrency = currency || 'INR';
        const rate = CONVERSION_RATES[rzpCurrency] || 1;

        // Convert amounts to target currency
        const convertedSubtotal = totalAmount * rate;
        const convertedTax = convertedSubtotal * 0.05;
        const totalWithTax = convertedSubtotal + convertedTax;

        const multiplier = rzpCurrency === 'JPY' ? 1 : 100;
        const finalAmount = Math.round(totalWithTax * multiplier);

        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount: Number(totalWithTax.toFixed(2)),
            currency: rzpCurrency,
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

        if (paymentMethod === 'cashfree') {
            const request = {
                order_amount: Number(totalWithTax.toFixed(2)),
                order_currency: rzpCurrency,
                order_id: order._id.toString(),
                customer_details: {
                    customer_id: userId.toString(),
                    customer_name: shippingAddress.fullName,
                    customer_email: user.email,
                    customer_phone: shippingAddress.phone
                },
                order_meta: {
                    return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/checkout/cashfree-verify?order_id={order_id}`
                },
                order_note: "Clinical Equipment Purchase"
            };

            const response = await cashfree.PGCreateOrder(request);
            const cfData = response.data;

            order.cashfreeOrderId = cfData.cf_order_id;
            await order.save();

            return NextResponse.json({
                success: true,
                payment_session_id: cfData.payment_session_id,
                cf_order_id: cfData.cf_order_id,
                orderId: order._id,
                gateway: 'cashfree'
            });
        }

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || ''
        });

        const rzpOrder = await razorpay.orders.create({
            amount: finalAmount,
            currency: rzpCurrency,
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
            currency: rzpOrder.currency,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
        });

    } catch (error: any) {
        console.error('Checkout API Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
    }
}

