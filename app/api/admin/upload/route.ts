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

        // Define the upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');

        // Ensure directory exists (mkdir -p)
        await mkdir(uploadDir, { recursive: true });

        // Generate a unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.name) || '.jpg';
        const filename = `${uniqueSuffix}${extension}`;
        const filePath = path.join(uploadDir, filename);

        // Write the file
        await writeFile(filePath, buffer);

        // Return the public URL
        const publicUrl = `/uploads/products/${filename}`;

        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error: any) {
        console.error('Image upload error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to upload image' }, { status: 500 });
    }
}
