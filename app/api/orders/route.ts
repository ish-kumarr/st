import { NextRequest, NextResponse } from 'next/server'

// Sample orders storage - in a real application, this would be a database
const orders: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    let filteredOrders = orders

    // Filter by status if provided
    if (status) {
      filteredOrders = filteredOrders.filter(
        (o) => o.status.toLowerCase() === status.toLowerCase()
      )
    }

    // Limit results if provided
    if (limit) {
      const limitNum = parseInt(limit)
      if (!isNaN(limitNum)) {
        filteredOrders = filteredOrders.slice(0, limitNum)
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: filteredOrders,
        count: filteredOrders.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.customerName || !body.items || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: customerName, items',
        },
        { status: 400 }
      )
    }

    // Calculate total
    const total = body.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )

    // Create new order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      customerName: body.customerName,
      email: body.email || '',
      phone: body.phone || '',
      items: body.items,
      total: total,
      status: 'pending',
      shippingAddress: body.shippingAddress || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    orders.push(newOrder)

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        data: newOrder,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
      },
      { status: 500 }
    )
  }
}
