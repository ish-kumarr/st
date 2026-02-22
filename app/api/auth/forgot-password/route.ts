import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendOTPEmail } from '@/lib/email-service';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        // For security, don't reveal if user exists or not
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, a security code has been sent.'
            });
        }

        // Generate reset OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = {
            code: otpCode,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            type: 'password_reset',
        };
        await user.save();

        await sendOTPEmail(email, otpCode, 'password_reset');

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, a security code has been sent.',
        });

    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
