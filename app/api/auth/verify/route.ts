import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (user.isVerified && user.otp?.type === 'verification') {
            return NextResponse.json({ success: false, error: 'User already verified' }, { status: 400 });
        }

        // Check OTP
        if (!user.otp || user.otp.code !== otp) {
            return NextResponse.json({ success: false, error: 'Invalid security code' }, { status: 400 });
        }

        if (new Date() > user.otp.expiresAt) {
            return NextResponse.json({ success: false, error: 'Security code expired' }, { status: 400 });
        }

        // Mark as verified
        user.isVerified = true;
        user.otp = undefined; // Clear OTP after use
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Verification successful. You can now sign in.',
        });

    } catch (error: any) {
        console.error('Verify error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
