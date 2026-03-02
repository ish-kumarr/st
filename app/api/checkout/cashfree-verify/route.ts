import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

const cashfree = new Cashfree(
    process.env.CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    process.env.CASHFREE_CLIENT_ID || '',
    process.env.CASHFREE_CLIENT_SECRET || ''
);
cashfree.XApiVersion = "2023-08-01";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('order_id');

        if (!orderId) {
            return NextResponse.json({ success: false, error: 'Missing order_id' }, { status: 400 });
        }

        await dbConnect();

        // Check status with Cashfree
        const response = await cashfree.PGOrderFetchPayments(orderId);
        const payments = response.data;

        const successPayment = payments.find((p: any) => p.payment_status === 'SUCCESS');

        if (successPayment) {
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = 'paid';
                order.paymentMethod = 'cashfree';
                await order.save();
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart?success=true`);
            }
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart?error=payment_failed`);

    } catch (error: any) {
        console.error('Cashfree Verification Error:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart?error=server_error`);
    }
}
