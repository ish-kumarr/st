import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from './mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'clinical_security_fallback';

export async function getAuthenticatedAdmin(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        await dbConnect();
        const user = await User.findById(decoded.userId);

        if (user && user.role === 'admin') {
            return user;
        }
        return null;
    } catch (err) {
        return null;
    }
}
