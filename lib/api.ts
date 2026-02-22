/**
 * API utilities for Satyavij Medical Equipment E-commerce
 * Provides helper functions for making API calls to backend endpoints
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  image: string
  inStock: boolean
  rating?: number
  reviews?: number
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: string
  estimatedDelivery?: string
}

/**
 * Fetch all products with optional filtering
 */
export async function fetchProducts(filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}): Promise<ApiResponse<Product[]>> {
  try {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.inStock !== undefined) params.append('inStock', filters.inStock.toString())

    const response = await fetch(`/api/products?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
    }
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProduct(id: number): Promise<ApiResponse<Product>> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch product',
    }
  }
}

/**
 * Create a new order
 */
export async function createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<ApiResponse<Order>> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    }
  }
}

/**
 * Fetch order by ID
 */
export async function fetchOrder(orderId: string): Promise<ApiResponse<Order>> {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch order',
    }
  }
}

/**
 * Request a quote for bulk orders
 */
export async function requestQuote(data: {
  products: Array<{ id: number; quantity: number }>
  companyName?: string
  email: string
  phone?: string
  message?: string
}): Promise<ApiResponse<{ quoteId: string; message: string }>> {
  try {
    const response = await fetch('/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to request quote: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to request quote',
    }
  }
}

/**
 * Check API health status
 */
export async function checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API health check failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Health check failed',
    }
  }
}

/**
 * Sign in user
 */
export async function signIn(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error(`Sign in failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign in failed',
    }
  }
}

/**
 * Sign up new user
 */
export async function signUp(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}): Promise<ApiResponse<{ userId: string; message: string }>> {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Sign up failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign up failed',
    }
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed',
    }
  }
}
