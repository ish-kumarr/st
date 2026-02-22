import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

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

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const userId = await getAuthenticatedUser(req);

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await Order.find({ user: userId })
            .populate('items.product', 'name image price')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
    }
}
