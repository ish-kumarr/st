import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'clinical_security_fallback';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        // Find user and include password (which is excluded by default)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.isVerified) {
            return NextResponse.json({
                success: false,
                error: 'Account not verified. Please verify your email.',
                needsVerification: true
            }, { status: 403 });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Create response with secure cookie
        const response = NextResponse.json({
            success: true,
            message: 'Signed in successfully',
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
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Signin error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
