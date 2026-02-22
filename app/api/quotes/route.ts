import { NextRequest, NextResponse } from 'next/server'

// Sample quotes storage
const quotes: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit')

    let filteredQuotes = quotes

    // Limit results if provided
    if (limit) {
      const limitNum = parseInt(limit)
      if (!isNaN(limitNum)) {
        filteredQuotes = filteredQuotes.slice(0, limitNum)
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: filteredQuotes,
        count: filteredQuotes.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quotes',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.organizationName || !body.email || !body.items || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: organizationName, email, items',
        },
        { status: 400 }
      )
    }

    // Create new quote request
    const newQuote = {
      id: `QUOTE-${Date.now()}`,
      organizationName: body.organizationName,
      contactPerson: body.contactPerson || '',
      email: body.email,
      phone: body.phone || '',
      items: body.items,
      notes: body.notes || '',
      status: 'pending', // pending, quoted, accepted, rejected
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    quotes.push(newQuote)

    return NextResponse.json(
      {
        success: true,
        message: 'Quote request created successfully',
        data: newQuote,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create quote request',
      },
      { status: 500 }
    )
  }
}
