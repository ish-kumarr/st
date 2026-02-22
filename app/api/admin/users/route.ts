import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
