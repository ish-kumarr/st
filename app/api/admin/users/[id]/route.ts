import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const userToDelete = await User.findById(params.id);

        if (!userToDelete) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (userToDelete.role === 'admin') {
            return NextResponse.json({ success: false, error: 'Cannot delete admin users' }, { status: 403 });
        }

        await User.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true, message: 'User deleted' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
