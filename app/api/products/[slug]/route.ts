import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect()
        const { slug } = await params

        const product = await Product.findOne({ slug })

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { success: true, data: product },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Error fetching product by slug:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch product' },
            { status: 500 }
        )
    }
}
