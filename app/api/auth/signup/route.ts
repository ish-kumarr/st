import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendOTPEmail } from '@/lib/email-service';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
            } else {
                // Resend OTP if not verified
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                existingUser.otp = {
                    code: otpCode,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
                    type: 'verification',
                };
                await existingUser.save();
                await sendOTPEmail(email, otpCode, 'verification');
                return NextResponse.json({ success: true, message: 'OTP resent to email' });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            otp: {
                code: otpCode,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
                type: 'verification',
            }
        });

        // Send OTP email
        await sendOTPEmail(email, otpCode, 'verification');

        return NextResponse.json({
            success: true,
            message: 'Account created. Please verify your email with the OTP sent.',
        }, { status: 201 });

    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
