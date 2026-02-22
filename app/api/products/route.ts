import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')
    const id = searchParams.get('id')

    let query: any = {}

    // Filter by id if provided
    if (id) {
      query._id = id;
    } else {
      // Filter by category if provided
      if (category && category !== 'all') {
        query.category = { $regex: new RegExp(category, 'i') }
      }
    }

    let productsQuery = Product.find(query).sort({ createdAt: -1 })

    // Limit results if provided
    if (limit) {
      const limitNum = parseInt(limit)
      if (!isNaN(limitNum)) {
        productsQuery = productsQuery.limit(limitNum)
      }
    }

    const products = await productsQuery

    return NextResponse.json(
      {
        success: true,
        data: products,
        count: products.length,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    const product = await Product.create(body)

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: product,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create product',
      },
      { status: 500 }
    )
  }
}

