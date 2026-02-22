import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'clinical_security_fallback';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const token = req.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }
}
