# SatyaVij API Endpoints Reference

## 📡 Complete API Structure

All endpoints are ready for backend integration with your database.

---

## 🛍️ Products API

### Get All Products
```
GET /api/products

Query Parameters:
  - category: string (optional)
  - search: string (optional)
  - sort: 'newest' | 'price-low' | 'price-high' | 'rating'
  - limit: number (default: 12)
  - offset: number (default: 0)

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Digital Stethoscope",
      "category": "Diagnostic",
      "price": 299,
      "rating": 4.8,
      ...
    }
  ],
  "total": 12
}
```

### Get Single Product
```
GET /api/products/[id]

Path Parameters:
  - id: number (required)

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Digital Stethoscope",
    "category": "Diagnostic",
    "description": "...",
    "fullDescription": "...",
    "price": 299,
    "originalPrice": 449,
    "rating": 4.8,
    "reviews": 1247,
    "specifications": {...},
    "features": [...],
    "certifications": [...],
    "warranty": "2-year",
    "seller": {...},
    "shipping": {...}
  }
}
```

### Search Products
```
GET /api/products/search

Query Parameters:
  - q: string (required) - search term
  - limit: number (default: 20)

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Digital Stethoscope",
      "category": "Diagnostic",
      "price": 299,
      "image": "/images/product-1.jpg"
    }
  ],
  "total": 3
}
```

### Get Categories
```
GET /api/products/categories

Response:
{
  "success": true,
  "data": [
    "Diagnostic",
    "Monitoring",
    "Operating Room",
    "Diagnostic Imaging",
    "Pharmacy",
    "Patient Care",
    "Emergency",
    "Respiratory"
  ]
}
```

---

## 🛒 Cart API

### Get Cart
```
GET /api/cart

Headers:
  - Authorization: Bearer {token} (optional)
  - X-Cart-Id: {cartId} (for guest carts)

Response:
{
  "success": true,
  "data": {
    "id": "cart-123",
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 299,
        "subtotal": 598
      }
    ],
    "subtotal": 598,
    "shipping": 0,
    "tax": 48,
    "total": 646
  }
}
```

### Add to Cart
```
POST /api/cart/items

Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json

Request Body:
{
  "productId": 1,
  "quantity": 2
}

Response:
{
  "success": true,
  "data": {
    "cartId": "cart-123",
    "itemCount": 3,
    "total": 645
  }
}
```

### Update Cart Item
```
PUT /api/cart/items/[productId]

Path Parameters:
  - productId: number (required)

Request Body:
{
  "quantity": 3
}

Response:
{
  "success": true,
  "data": {
    "cartId": "cart-123",
    "item": {
      "productId": 1,
      "quantity": 3,
      "subtotal": 897
    },
    "cartTotal": 945
  }
}
```

### Remove from Cart
```
DELETE /api/cart/items/[productId]

Path Parameters:
  - productId: number (required)

Response:
{
  "success": true,
  "data": {
    "cartId": "cart-123",
    "removed": true,
    "cartTotal": 348
  }
}
```

### Clear Cart
```
DELETE /api/cart

Response:
{
  "success": true,
  "data": {
    "cleared": true,
    "cartId": "cart-123"
  }
}
```

---

## 📦 Orders API

### Create Order
```
POST /api/orders

Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json

Request Body:
{
  "cartId": "cart-123",
  "shippingAddress": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "address": "123 Hospital Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "paymentMethod": "stripe",
  "paymentToken": "pm_123456"
}

Response:
{
  "success": true,
  "data": {
    "orderId": "ORD-123456",
    "status": "pending_payment",
    "total": 645,
    "estimatedDelivery": "2024-03-15",
    "trackingUrl": "https://..."
  }
}
```

### Get Order
```
GET /api/orders/[orderId]

Path Parameters:
  - orderId: string (required)

Headers:
  - Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "orderId": "ORD-123456",
    "status": "shipped",
    "items": [
      {
        "productId": 1,
        "name": "Digital Stethoscope",
        "quantity": 2,
        "price": 299,
        "subtotal": 598
      }
    ],
    "subtotal": 598,
    "shipping": 0,
    "tax": 48,
    "total": 646,
    "shippingAddress": {...},
    "trackingNumber": "TRK123456789",
    "estimatedDelivery": "2024-03-15",
    "createdAt": "2024-03-05T10:30:00Z",
    "updatedAt": "2024-03-08T14:22:00Z"
  }
}
```

### Get User Orders
```
GET /api/orders

Headers:
  - Authorization: Bearer {token}

Query Parameters:
  - status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  - limit: number (default: 20)
  - offset: number (default: 0)

Response:
{
  "success": true,
  "data": [
    {
      "orderId": "ORD-123456",
      "status": "shipped",
      "total": 646,
      "itemCount": 3,
      "createdAt": "2024-03-05T10:30:00Z",
      "trackingUrl": "https://..."
    }
  ],
  "total": 5
}
```

### Cancel Order
```
PUT /api/orders/[orderId]/cancel

Path Parameters:
  - orderId: string (required)

Headers:
  - Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "orderId": "ORD-123456",
    "status": "cancelled",
    "refundStatus": "processing",
    "refundAmount": 646,
    "message": "Your order has been cancelled. Refund will be processed within 5-7 business days."
  }
}
```

---

## 💬 Quotes API

### Request Quote
```
POST /api/quotes

Request Body:
{
  "name": "Hospital Name",
  "email": "contact@hospital.com",
  "phone": "+91-9876543210",
  "institution": "Apollo Hospital",
  "department": "Cardiology",
  "products": [
    {
      "productId": 1,
      "quantity": 5
    },
    {
      "productId": 3,
      "quantity": 10
    }
  ],
  "message": "We need bulk quotes for our new cardiology unit",
  "budget": "100000-500000"
}

Response:
{
  "success": true,
  "data": {
    "quoteId": "QT-123456",
    "status": "received",
    "message": "Your quote request has been received. Our team will contact you within 24 hours.",
    "expectedResponse": "2024-03-06T10:30:00Z"
  }
}
```

### Get Quote
```
GET /api/quotes/[quoteId]

Path Parameters:
  - quoteId: string (required)

Response:
{
  "success": true,
  "data": {
    "quoteId": "QT-123456",
    "status": "quote_ready",
    "requestedAt": "2024-03-05T10:30:00Z",
    "quotedAt": "2024-03-05T15:45:00Z",
    "items": [
      {
        "productId": 1,
        "name": "Digital Stethoscope",
        "quantity": 5,
        "unitPrice": 299,
        "lineTotal": 1495,
        "discount": 0.15
      }
    ],
    "subtotal": 1495,
    "discount": 224,
    "tax": 101,
    "total": 1372,
    "validUntil": "2024-03-20T10:30:00Z",
    "notes": "Special institutional pricing applied"
  }
}
```

### Accept Quote
```
PUT /api/quotes/[quoteId]/accept

Path Parameters:
  - quoteId: string (required)

Request Body:
{
  "email": "contact@hospital.com",
  "paymentMethod": "purchase_order"
}

Response:
{
  "success": true,
  "data": {
    "quoteId": "QT-123456",
    "status": "accepted",
    "orderId": "ORD-456789",
    "message": "Quote accepted. Your order has been created.",
    "nextSteps": "A sales representative will contact you to finalize delivery details."
  }
}
```

---

## 👤 User API

### Register User
```
POST /api/users/register

Request Body:
{
  "name": "John Doe",
  "email": "john@hospital.com",
  "password": "secure_password_123",
  "institution": "Apollo Hospital",
  "role": "procurement" | "doctor" | "admin"
}

Response:
{
  "success": true,
  "data": {
    "userId": "user-123",
    "email": "john@hospital.com",
    "token": "eyJhbGc...",
    "message": "Account created successfully"
  }
}
```

### Login User
```
POST /api/users/login

Request Body:
{
  "email": "john@hospital.com",
  "password": "secure_password_123"
}

Response:
{
  "success": true,
  "data": {
    "userId": "user-123",
    "email": "john@hospital.com",
    "name": "John Doe",
    "institution": "Apollo Hospital",
    "token": "eyJhbGc...",
    "expiresIn": 86400
  }
}
```

### Get User Profile
```
GET /api/users/profile

Headers:
  - Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "userId": "user-123",
    "name": "John Doe",
    "email": "john@hospital.com",
    "institution": "Apollo Hospital",
    "role": "procurement",
    "phone": "+91-9876543210",
    "addresses": [...],
    "createdAt": "2024-03-01T10:30:00Z"
  }
}
```

### Update User Profile
```
PUT /api/users/profile

Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json

Request Body:
{
  "name": "John Doe Updated",
  "phone": "+91-9876543211",
  "institution": "Apollo Hospital - Updated"
}

Response:
{
  "success": true,
  "data": {
    "userId": "user-123",
    "name": "John Doe Updated",
    "message": "Profile updated successfully"
  }
}
```

### Logout
```
POST /api/users/logout

Headers:
  - Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## ⭐ Reviews & Ratings API

### Get Product Reviews
```
GET /api/products/[productId]/reviews

Query Parameters:
  - limit: number (default: 10)
  - offset: number (default: 0)
  - sort: 'recent' | 'helpful' | 'rating-high' | 'rating-low'

Response:
{
  "success": true,
  "data": [
    {
      "reviewId": "REV-123",
      "userId": "user-456",
      "userName": "Dr. Smith",
      "rating": 5,
      "title": "Excellent Product",
      "content": "Great quality and reliable...",
      "helpful": 45,
      "notHelpful": 2,
      "verified": true,
      "createdAt": "2024-03-01T10:30:00Z"
    }
  ],
  "total": 1247,
  "averageRating": 4.8
}
```

### Add Review
```
POST /api/products/[productId]/reviews

Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json

Request Body:
{
  "rating": 5,
  "title": "Excellent Product",
  "content": "This stethoscope is amazing...",
  "orderId": "ORD-123456"
}

Response:
{
  "success": true,
  "data": {
    "reviewId": "REV-789",
    "status": "published",
    "message": "Thank you for your review!"
  }
}
```

---

## 🏥 Wishlist API

### Get Wishlist
```
GET /api/wishlist

Headers:
  - Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": 1,
        "name": "Digital Stethoscope",
        "price": 299,
        "rating": 4.8,
        "savedAt": "2024-03-05T10:30:00Z"
      }
    ],
    "total": 3
  }
}
```

### Add to Wishlist
```
POST /api/wishlist

Headers:
  - Authorization: Bearer {token}

Request Body:
{
  "productId": 1
}

Response:
{
  "success": true,
  "data": {
    "productId": 1,
    "added": true,
    "message": "Added to wishlist"
  }
}
```

### Remove from Wishlist
```
DELETE /api/wishlist/[productId]

Headers:
  - Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "productId": 1,
    "removed": true
  }
}
```

---

## 💳 Payment API

### Process Payment
```
POST /api/payments

Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json

Request Body:
{
  "orderId": "ORD-123456",
  "amount": 646,
  "currency": "INR",
  "paymentMethod": "stripe" | "razorpay" | "bank_transfer",
  "paymentToken": "pm_123456"
}

Response:
{
  "success": true,
  "data": {
    "paymentId": "PAY-123456",
    "status": "success",
    "orderId": "ORD-123456",
    "amount": 646,
    "transactionId": "txn_123456",
    "message": "Payment processed successfully"
  }
}
```

### Get Payment Status
```
GET /api/payments/[paymentId]

Response:
{
  "success": true,
  "data": {
    "paymentId": "PAY-123456",
    "status": "completed",
    "orderId": "ORD-123456",
    "amount": 646,
    "transactionId": "txn_123456",
    "processedAt": "2024-03-05T10:30:00Z"
  }
}
```

---

## 📞 Support API

### Create Support Ticket
```
POST /api/support/tickets

Request Body:
{
  "name": "John Doe",
  "email": "john@hospital.com",
  "productId": 1,
  "subject": "Technical Issue",
  "category": "technical_support" | "product_inquiry" | "shipping" | "billing",
  "message": "I'm experiencing an issue with..."
}

Response:
{
  "success": true,
  "data": {
    "ticketId": "SUP-123456",
    "status": "open",
    "priority": "normal",
    "estimatedResponse": "2024-03-05T18:00:00Z",
    "message": "Your support ticket has been created"
  }
}
```

---

## 🔐 Authentication

All protected endpoints require:

```
Headers:
  Authorization: Bearer {jwt_token}

Token Format:
  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Analytics API

### Get Product Analytics
```
GET /api/analytics/products/[productId]

Query Parameters:
  - period: 'day' | 'week' | 'month' | 'year'

Response:
{
  "success": true,
  "data": {
    "productId": 1,
    "views": 5432,
    "clicks": 1234,
    "addToCart": 456,
    "purchases": 123,
    "conversionRate": 0.089,
    "averageRating": 4.8,
    "topCountry": "India"
  }
}
```

---

## ⚠️ Error Responses

All endpoints may return error responses:

```
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product does not exist",
    "statusCode": 404
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `SERVER_ERROR` (500): Internal server error

---

## 🧪 Testing Endpoints

Use these commands to test the API:

```bash
# Get all products
curl -X GET http://localhost:3000/api/products

# Get single product
curl -X GET http://localhost:3000/api/products/1

# Search products
curl -X GET "http://localhost:3000/api/products/search?q=stethoscope"

# Create order (requires auth)
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cartId":"cart-123",...}'
```

---

## 📚 API Documentation

- **Base URL**: `https://satyavij.com/api` (production)
- **Version**: v1
- **Rate Limit**: 1000 requests/hour per IP
- **Response Format**: JSON
- **Content-Type**: application/json

---

**All endpoints are ready for backend implementation. Start with database integration!**

