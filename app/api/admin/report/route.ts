import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';

function escapeCSV(field: any): string {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export async function GET(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const allOrders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email').populate('items.product', 'name category price');

        const totalOrders = allOrders.length;
        const validOrders = allOrders.filter(o => o.status !== 'cancelled');
        const totalSales = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const avgOrderValue = validOrders.length > 0 ? totalSales / validOrders.length : 0;
        const productsCount = await Product.countDocuments();

        const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
        const formatDate = (date: any) => new Date(date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Satyavij Admin Report</title>
    <style>
        :root {
            --bg: #f8f9fc;
            --surface: #ffffff;
            --text: #0a0a0a;
            --text-muted: #666666;
            --border: #eaeaea;
            --primary: #000000;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 40px;
            line-height: 1.5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--primary);
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -1px;
        }
        .header p {
            margin: 5px 0 0;
            color: var(--text-muted);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: bold;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .metric-card {
            background: var(--surface);
            padding: 24px;
            border: 1px solid var(--border);
            border-radius: 4px;
        }
        .metric-label {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--text-muted);
            margin-bottom: 8px;
        }
        .metric-value {
            font-size: 28px;
            font-weight: 900;
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: var(--surface);
            border: 1px solid var(--border);
        }
        th, td {
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }
        th {
            background: #fbfbfb;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
        }
        td {
            font-size: 13px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 2px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #f0f0f0;
        }
        .status-delivered { background: #e0f2fe; color: #0284c7; }
        .status-processing { background: #fef3c7; color: #d97706; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }
        .products-list {
            margin: 0;
            padding-left: 16px;
            font-size: 12px;
            color: var(--text-muted);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>Satyavij Admin Report</h1>
                <p>Comprehensive Store Analytics</p>
            </div>
            <div style="text-align: right;">
                <p>Generated On</p>
                <div style="font-size: 14px; font-weight: 600;">${formatDate(new Date())}</div>
            </div>
        </div>

        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-label">Total Revenue</div>
                <div class="metric-value">${formatCurrency(totalSales)}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Valid Orders</div>
                <div class="metric-value">${validOrders.length}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Avg Order Value</div>
                <div class="metric-value">${formatCurrency(avgOrderValue)}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Catalog Products</div>
                <div class="metric-value">${productsCount}</div>
            </div>
        </div>

        <h2 style="font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Order Details</h2>
        
        <table>
            <thead>
                <tr>
                    <th>Order Info</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total Value</th>
                    <th>Items Included</th>
                </tr>
            </thead>
            <tbody>
                ${allOrders.map(order => `
                <tr>
                    <td>
                        <div style="font-weight: 700; font-family: monospace;">#${String(order._id).slice(-8)}</div>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${formatDate(order.createdAt)}</div>
                    </td>
                    <td>
                        <div style="font-weight: 600;">${order.user ? order.user.name : order.shippingAddress.name}</div>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${order.user ? order.user.email : order.shippingAddress.email}</div>
                    </td>
                    <td>
                        <div class="status-badge status-${order.status}">${order.status}</div>
                    </td>
                    <td style="font-weight: 700;">
                        ${formatCurrency(order.totalAmount)}
                    </td>
                    <td>
                        <ul class="products-list">
                            ${order.items && order.items.length > 0
                ? order.items.map((item: any) => `<li>${item.product ? item.product.name : 'Unknown Product'} &times; ${item.quantity}</li>`).join('')
                : '<li>No items</li>'
            }
                        </ul>
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>`;

        return new NextResponse(htmlContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Disposition': 'attachment; filename="admin_report.html"'
            }
        });

    } catch (error: any) {
        console.error('Report generation error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
