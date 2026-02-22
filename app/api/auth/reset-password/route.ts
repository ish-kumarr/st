import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ success: false, error: 'Email, OTP, and new password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Check OTP
        if (!user.otp || user.otp.code !== otp || user.otp.type !== 'password_reset') {
            return NextResponse.json({ success: false, error: 'Invalid or expired security code' }, { status: 400 });
        }

        if (new Date() > user.otp.expiresAt) {
            return NextResponse.json({ success: false, error: 'Security code expired' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        user.otp = undefined; // Clear OTP
        user.isVerified = true; // Mark as verified if they reset password successfully
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully. You can now sign in with your new password.',
        });

    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
