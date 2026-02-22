import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, products });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const data = await req.json();

        // Generate slug if not provided
        if (!data.slug) {
            data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const product = await Product.create(data);
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
