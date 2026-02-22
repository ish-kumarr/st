import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const data = await req.json();
        const { id } = await params;
        const product = await Product.findByIdAndUpdate(id, data, { returnDocument: 'after' });

        if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { id } = await params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
