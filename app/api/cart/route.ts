import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';

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
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await User.findById(userId).populate('cart.product');
        return NextResponse.json({ success: true, cart: user.cart });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const userId = await getAuthenticatedUser(req);
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const { productId, quantity } = await req.json();

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        // Check if product already in cart
        const existingItemIndex = user.cart.findIndex(
            (item: any) => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            user.cart[existingItemIndex].quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        return NextResponse.json({ success: true, message: 'Cart synchronized' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const userId = await getAuthenticatedUser(req);
        if (!userId) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

        const { productId } = await req.json();
        const user = await User.findById(userId);

        user.cart = user.cart.filter((item: any) => item.product.toString() !== productId);
        await user.save();

        return NextResponse.json({ success: true, message: 'Item removed from clinical cart' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
