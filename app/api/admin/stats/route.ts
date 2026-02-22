import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const allOrders = await Order.find({ status: { $ne: 'cancelled' } });
        const totalSales = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = allOrders.length;

        const allProducts = await Product.find({});
        const totalProducts = allProducts.length;
        const totalInventoryUnits = allProducts.reduce((sum, p) => sum + (p.stock || 0), 0);

        const totalUsers = await User.countDocuments();

        // Get recent trends (last 7 days vs previous 7 days)
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const calcTrend = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? '+100%' : '+0%';
            const percent = ((curr - prev) / prev) * 100;
            return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
        };

        const currentOrders = await Order.find({ createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'cancelled' } });
        const previousOrders = await Order.find({ createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }, status: { $ne: 'cancelled' } });

        const currentSales = currentOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const previousSales = previousOrders.reduce((sum, o) => sum + o.totalAmount, 0);

        const revenueTrend = calcTrend(currentSales, previousSales);
        const ordersTrend = calcTrend(currentOrders.length, previousOrders.length);

        const currentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        const previousUsers = await User.countDocuments({ createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } });
        const usersTrend = calcTrend(currentUsers, previousUsers);

        const currentProducts = await Product.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        const previousProducts = await Product.countDocuments({ createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } });
        const productsTrend = calcTrend(currentProducts, previousProducts);

        const categories = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);
        const topCategory = categories.length > 0 ? categories[0]._id : "General";

        const summaryText = `Revenue ${currentSales >= previousSales ? 'is up' : 'is down'} compared to last week. The most stocked database category right now is "${topCategory}".`;

        return NextResponse.json({
            success: true,
            stats: {
                totalSales,
                revenueTrend,
                totalOrders,
                ordersTrend,
                totalProducts,
                totalInventoryUnits,
                productsTrend,
                totalUsers,
                usersTrend,
                summaryText,
                currency: 'INR'
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
