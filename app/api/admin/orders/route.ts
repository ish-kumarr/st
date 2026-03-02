import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { sendOrderUpdateEmail } from '@/lib/email-service';

export async function GET(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.product', 'name image')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { orderId, status, paymentStatus, invoiceUrl } = await req.json();

        const updateData: any = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (invoiceUrl !== undefined) updateData.invoiceUrl = invoiceUrl; // Allow clearing with empty string

        const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true }).populate('user', 'email');

        if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

        // Send email update to user
        if (order.user && (order.user as any).email) {
            // we only really want to send email if status or invoiceUrl was specifically updated
            if (status || invoiceUrl) {
                let absoluteInvoiceUrl = order.invoiceUrl;
                if (absoluteInvoiceUrl && absoluteInvoiceUrl.startsWith('/')) {
                    absoluteInvoiceUrl = `${req.nextUrl.origin}${absoluteInvoiceUrl}`;
                }

                // don't await so we don't block the response, but catch errors
                sendOrderUpdateEmail((order.user as any).email, order._id.toString(), order.status, absoluteInvoiceUrl).catch(console.error);
            }
        }

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
