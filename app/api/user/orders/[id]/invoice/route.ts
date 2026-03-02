import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import PDFDocument from 'pdfkit';
import path from 'path';

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        // Optional: verify the user owns the order, but we can also just let order ID be unguessable.
        // For security, let's verify if they're logged in
        const userId = await getAuthenticatedUser(req);
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const order = await Order.findOne({ _id: id, user: userId }).populate('items.product', 'name price');
        if (!order) {
            return new NextResponse('Order not found', { status: 404 });
        }

        // Return a readable stream for the PDF
        const stream = new ReadableStream({
            start(controller) {
                const doc = new PDFDocument({ margin: 50 });

                doc.on('data', (chunk) => controller.enqueue(chunk));
                doc.on('end', () => controller.close());

                // Generate PDF Content
                // 1. Header (Logo + Company Name on left, Invoice title on right)
                const logoPath = path.join(process.cwd(), 'public', 'images', 'Logo.png');
                try {
                    doc.image(logoPath, 50, 45, { width: 60 });
                    doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text('Satyavij Healthcare Pvt. Ltd.', 120, 48);
                    doc.fontSize(9).font('Helvetica').fillColor('#555555');
                    doc.text('Gali No-1, Devi Lal Colony, Mehalana Road,', 120, 68);
                    doc.text('Sonipat, Haryana - 131001, India', 120, 80);
                    doc.font('Helvetica-Bold').text('GSTIN: 06ABACS7617K2Z3', 120, 92);
                } catch (e) {
                    doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text('Satyavij Healthcare Pvt. Ltd.', 50, 48);
                    doc.fontSize(9).font('Helvetica').fillColor('#555555');
                    doc.text('Gali No-1, Devi Lal Colony, Mehalana Road,', 50, 68);
                    doc.text('Sonipat, Haryana - 131001, India', 50, 80);
                    doc.font('Helvetica-Bold').text('GSTIN: 06ABACS7617K2Z3', 50, 92);
                }

                doc.fontSize(20).font('Helvetica-Bold').fillColor('#333333').text('INVOICE', 0, 50, { align: 'right', width: 545 });
                doc.fontSize(10).font('Helvetica').fillColor('#666666').text('Receipt of Purchase', 0, 75, { align: 'right', width: 545 });

                // Divider
                doc.moveTo(50, 120).lineTo(545, 120).strokeColor('#eeeeee').stroke();

                // 2. Info Section (2 Columns)
                const infoTopY = 140;

                // Left Column: Shipping Info
                doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000').text('BILLED / SHIPPED TO:', 50, infoTopY);
                doc.moveDown(0.5);
                doc.fontSize(10).font('Helvetica').fillColor('#555555');
                doc.text(order.shippingAddress.fullName, 50, doc.y);
                if (order.shippingAddress.companyName) doc.text(order.shippingAddress.companyName, 50, doc.y);
                if (order.shippingAddress.gstNumber) doc.text(`GSTIN: ${order.shippingAddress.gstNumber}`, 50, doc.y);
                doc.text(order.shippingAddress.addressLine1, 50, doc.y);
                if (order.shippingAddress.addressLine2) doc.text(order.shippingAddress.addressLine2, 50, doc.y);
                doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`, 50, doc.y);
                doc.text(order.shippingAddress.country, 50, doc.y);
                doc.text(`Phone: ${order.shippingAddress.phone}`, 50, doc.y);

                // Right Column: Order Details
                doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000').text('ORDER DETAILS:', 350, infoTopY);
                doc.moveDown(0.5);
                doc.fontSize(10).font('Helvetica').fillColor('#555555');
                doc.text(`Order ID: #${order._id.toString().toUpperCase()}`, 350, doc.y);
                doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 350, doc.y);
                doc.text(`Payment: ${order.paymentMethod.toUpperCase()}`, 350, doc.y);
                doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`, 350, doc.y);
                doc.text(`Order Status: ${order.status.toUpperCase()}`, 350, doc.y);

                // 3. Table Header
                doc.moveDown(4);
                const tableY = Math.max(doc.y, 280);
                doc.y = tableY;

                // Table Header background
                doc.rect(50, doc.y - 10, 495, 25).fillColor('#f9f9f9').fill();

                doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000');
                doc.text('ITEM DESCRIPTION', 60, tableY, { continued: false });
                doc.text('QTY', 350, tableY, { align: 'right', width: 50 });
                doc.text('PRICE', 450, tableY, { align: 'right', width: 85 });

                doc.y = tableY + 20;

                // 4. Items
                doc.fontSize(10).font('Helvetica').fillColor('#333333');
                let yPosition = doc.y;
                for (const item of order.items) {
                    const itemName = item.product?.name || 'Unknown Product';
                    const qty = item.quantity.toString();
                    const priceStr = `INR ${item.priceAtTime.toLocaleString()}`;

                    doc.text(itemName, 60, yPosition, { width: 280, continued: false });
                    doc.text(qty, 350, yPosition, { align: 'right', width: 50 });
                    doc.text(priceStr, 450, yPosition, { align: 'right', width: 85 });
                    yPosition = doc.y + 15;
                }

                doc.y = yPosition + 10;
                doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#eeeeee').stroke();
                doc.moveDown(1.5);

                // 5. Totals
                doc.fontSize(10).font('Helvetica-Bold').fillColor('#555555');
                doc.text('Subtotal:', 300, doc.y, { continued: false, align: 'right', width: 100 });
                doc.text(`INR ${order.totalAmount.toLocaleString()}`, 420, doc.y - 12, { align: 'right', width: 115 });
                doc.moveDown(0.5);

                const tax = order.totalAmount * 0.05;
                doc.text('Taxes (Estimated 5%):', 300, doc.y, { continued: false, align: 'right', width: 100 });
                doc.text(`INR ${tax.toLocaleString()}`, 420, doc.y - 12, { align: 'right', width: 115 });
                doc.moveDown(1);

                const finalTotal = order.totalAmount + tax;
                doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000');
                doc.text('Total Amount:', 300, doc.y, { continued: false, align: 'right', width: 100 });
                doc.text(`INR ${finalTotal.toLocaleString()}`, 420, doc.y - 14, { align: 'right', width: 115 });

                doc.moveDown(4);
                doc.fontSize(10).font('Helvetica').fillColor('grey').text('Thank you for shopping with Satyavij Healthcare Pvt. Ltd.', 50, doc.y, { align: 'center', width: 495 });

                // Finalize the PDF
                doc.end();
            }
        });

        return new NextResponse(stream as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Invoice_${order._id.toString().slice(-6)}.pdf"`
            }
        });
    } catch (error: any) {
        console.error('Invoice generation error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
