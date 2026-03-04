import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file received.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');

        const imgbbKey = process.env.IMGBB_API_KEY;
        if (!imgbbKey) {
            return NextResponse.json({ success: false, error: 'IMGBB_API_KEY is not configured.' }, { status: 500 });
        }

        const imgbbFormData = new URLSearchParams();
        imgbbFormData.append('image', base64Image);

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
            method: 'POST',
            body: imgbbFormData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const imgbbData = await imgbbResponse.json();

        if (!imgbbResponse.ok || !imgbbData.success) {
            console.error('ImgBB upload error response:', imgbbData);
            return NextResponse.json({ success: false, error: imgbbData.error?.message || 'Failed to upload image to ImgBB' }, { status: 500 });
        }

        const publicUrl = imgbbData.data.url;

        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error: any) {
        console.error('Image upload error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to upload image' }, { status: 500 });
    }
}
