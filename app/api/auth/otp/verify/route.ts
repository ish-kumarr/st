import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'clinical_security_fallback';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ success: false, error: 'Email and code are required.' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
        }

        // Validate OTP
        if (!user.otp || user.otp.code !== otp || user.otp.type !== 'login') {
            return NextResponse.json({ success: false, error: 'Invalid or expired code.' }, { status: 400 });
        }

        if (new Date() > user.otp.expiresAt) {
            return NextResponse.json({ success: false, error: 'Code has expired.' }, { status: 400 });
        }

        // Clear OTP
        user.otp = undefined;
        await user.save();

        // Create JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            success: true,
            message: 'Login successful.',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('OTP Verify Error:', error);
        return NextResponse.json({ success: false, error: 'System failure during verification.' }, { status: 500 });
    }
}
