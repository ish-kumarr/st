import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

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

            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully.'
            });

        } else {
            return NextResponse.json({ success: false, error: 'Cryptographic signature verification failed' }, { status: 400 });
        }

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
