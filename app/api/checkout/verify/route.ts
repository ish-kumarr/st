import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { sendOrderUpdateEmail } from '@/lib/email-service';

const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Find the order that was created in /api/checkout and update its status
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

            if (!order) {
                return NextResponse.json({ success: false, error: 'Order not found for this transaction' }, { status: 404 });
            }

            order.razorpayPaymentId = razorpay_payment_id;
            order.paymentStatus = 'paid';
            order.status = 'processing';
            await order.save();

            // Populate user for email
            await order.populate('user', 'email');

            // Decrement Stock only after payment success
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stockCount = Math.max(0, product.stockCount - item.quantity);
                    if (product.stockCount === 0) {
                        product.inStock = false;
                    }
                    await product.save();
                }
            }

            // Send confirmation email with invoice link
            if (order.user && (order.user as any).email) {
                const email = (order.user as any).email;
                // Construct relative invoice URL for now, or use absolute if env base url is available
                const invoiceUrl = `/api/user/orders/${order._id}/invoice`;
                // Trigger email without awaiting to keep checkout fast
                sendOrderUpdateEmail(email, order._id.toString(), 'confirmed', invoiceUrl).catch(err => {
                    console.error('Failed to send order confirmation email:', err);
                });
            }

            return NextResponse.json({
                success: true,
                message: 'Payment verified and order confirmed successfully.'
            });

        } else {
            return NextResponse.json({ success: false, error: 'Cryptographic signature verification failed' }, { status: 400 });
        }

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
