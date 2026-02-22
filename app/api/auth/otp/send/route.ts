import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendOTPEmail } from '@/lib/email-service';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
        }

        const adminEmail = 'satyavij.care@gmail.com';
        const isTargetAdmin = email.toLowerCase() === adminEmail.toLowerCase();

        if (isTargetAdmin) {
            let user = await User.findOne({ email: adminEmail });

            // Auto-create admin if missing
            if (!user) {
                // Generate a strong random password since the schema requires it,
                // though the admin will use OTP to login.
                const tempPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16);
                const hashedPassword = await bcrypt.hash(tempPassword, 12);

                user = await User.create({
                    email: adminEmail,
                    name: 'Admin',
                    password: hashedPassword,
                    role: 'admin',
                    isVerified: true
                });
            } else if (user.role !== 'admin') {
                user.role = 'admin';
            }

            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = {
                code: otpCode,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                type: 'login',
            };
            await user.save();
            await sendOTPEmail(email, otpCode, 'login');
        }

        // Universal success message
        return NextResponse.json({
            success: true,
            message: 'Check your email for the code.',
        });

    } catch (error: any) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
