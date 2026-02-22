# SatyaVij Website Sitemap

## Navigation Structure

```
SatyaVij (Logo/Home)
│
├── Products
│   ├── Product Listing (/products)
│   │   ├── Filter by Category
│   │   ├── Sort by Price/Rating
│   │   └── Product Cards → View Details
│   │
│   └── Product Details (/products/[id])
│       ├── Product Image
│       ├── Specifications
│       ├── Features List
│       ├── Add to Cart
│       ├── Request Quote
│       └── Contact Sales
│
├── Cart (/cart)
│   ├── Cart Items
│   ├── Quantity Management
│   ├── Order Summary
│   ├── Checkout
│   └── Continue Shopping
│
├── Sign In (/signin)
│   ├── Email/Password Login
│   ├── Remember Me
│   ├── Forgot Password
│   ├── Social Login (Ready)
│   └── Sign Up Link
│
└── Footer
    ├── About
    ├── Products
    ├── Support
    ├── Contact
    └── Social Media
```

## Page Flow

```
User Journey:

1. Landing Page (/)
   ↓
2. Browse Products (/products)
   ↓
3. View Product Details (/products/[id])
   ↓
4. Add to Cart
   ↓
5. Review Cart (/cart)
   ↓
6. Sign In (/signin)
   ↓
7. Checkout (Ready for Stripe)
   ↓
8. Order Confirmation (Ready)
```

## API Endpoints Structure

```
/api
│
├── /products
│   ├── GET - List all products
│   │   Query: ?category=&minPrice=&maxPrice=&inStock=
│   ├── POST - Create product
│   └── /[id]
│       ├── GET - Get product details
│       ├── PUT - Update product
│       └── DELETE - Delete product
│
├── /orders
│   ├── GET - List orders
│   ├── POST - Create order
│   └── /[id]
│       └── GET - Get order details
│
├── /quotes
│   ├── GET - List quotes
│   └── POST - Request quote
│
├── /health
│   └── GET - Health check
│
└── /auth (Ready for integration)
    ├── /signin - POST
    ├── /signup - POST
    └── /logout - POST
```

## Component Hierarchy

```
App Layout
│
├── Header (Sticky)
│   ├── Logo
│   ├── Navigation Menu
│   ├── Cart Button
│   └── Sign In Button
│
├── Main Content
│   ├── Landing Page
│   │   ├── Hero Section
│   │   ├── Features Section
│   │   ├── Products Section
│   │   └── CTA Section
│   │
│   ├── Products Page
│   │   ├── Sidebar (Filters)
│   │   └── Product Grid
│   │
│   ├── Product Detail Page
│   │   ├── Product Image
│   │   ├── Product Info
│   │   ├── Specs & Features
│   │   └── Trust Indicators
│   │
│   ├── Cart Page
│   │   ├── Cart Items List
│   │   ├── Quantity Controls
│   │   └── Order Summary
│   │
│   └── Sign In Page
│       ├── Login Form
│       ├── Social Login
│       └── Sign Up Link
│
└── Footer
    ├── Company Info
    ├── Links
    ├── Contact
    └── Social Media
```

## URL Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Landing | Home page with hero |
| `/products` | ProductsPage | Product catalog |
| `/products/[id]` | ProductDetail | Product details |
| `/cart` | CartPage | Shopping cart |
| `/signin` | SignIn | User authentication |
| `/api/health` | API | Health check |
| `/api/products` | API | Product endpoints |
| `/api/orders` | API | Order endpoints |
| `/api/quotes` | API | Quote endpoints |

## Data Flow

```
Client Side:
┌─────────────────────────────────────┐
│   React Components (Pages/UI)       │
│   - Landing Page                    │
│   - Products Page                   │
│   - Product Detail                  │
│   - Cart Page                       │
│   - Sign In Page                    │
└──────────────┬──────────────────────┘
               │
               ↓
       ┌───────────────┐
       │ /lib/api.ts   │ (API Utilities)
       │ fetch helpers │
       └───────────────┘
               │
               ↓
Server Side:
┌─────────────────────────────────────┐
│   API Routes (/app/api/)            │
│   - /products                       │
│   - /orders                         │
│   - /quotes                         │
│   - /health                         │
│   - /auth (Ready)                   │
└──────────────┬──────────────────────┘
               │
               ↓ (Ready to Connect)
       ┌───────────────┐
       │   Database    │
       │   (Any Type)  │
       └───────────────┘
```

## Feature Integration Points

```
Authentication
├── Sign In Page (/signin)
├── API Route (/api/auth/signin)
└── Database: User Table

Shopping
├── Products Page (/products)
├── Product Details (/products/[id])
├── Cart Page (/cart)
├── API Routes (/api/products)
└── Database: Products Table

Orders
├── Cart Checkout
├── API Route (/api/orders)
└── Database: Orders Table

Quotes
├── Quote Request Form
├── API Route (/api/quotes)
└── Database: Quotes Table
```

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Vercel Deployment           │
│  (Auto-builds on GitHub push)       │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        ↓             ↓
   Frontend       API Routes
   (Static)       (Serverless)
   - Pages        - /api/*
   - Components   - Functions
   - Assets
        │             │
        └──────┬───────┘
               ↓
   ┌──────────────────────┐
   │  Environment Vars    │
   │ - DB Connection      │
   │ - Auth Keys          │
   │ - Payment Keys       │
   └──────────────────────┘
```

## Mobile Navigation

```
Mobile Menu (Hamburger)
├── Products
├── Solutions
├── About
├── Contact
├── Cart
└── Sign In
```

## SEO Structure

```
Metadata:
├── Landing Page
│   ├── Title: SatyaVij - Medical Equipment & Solutions
│   ├── Description: Trusted supplier of medical equipment
│   └── OG Image: Hero image
│
├── Products Page
│   ├── Title: Medical Equipment Catalog
│   ├── Description: Browse professional medical devices
│   └── Structured Data: ProductCollection
│
└── Product Details
    ├── Title: [Product Name] - SatyaVij
    ├── Description: [Product description]
    └── Structured Data: Product
```

## Performance Optimization

```
Optimizations Implemented:
├── Image Optimization
│   ├── Next.js Image component
│   ├── Automatic resizing
│   └── Lazy loading
│
├── Code Splitting
│   ├── Per-route bundles
│   ├── Component lazy loading
│   └── Dynamic imports
│
├── Caching
│   ├── Static page generation ready
│   ├── ISR configuration ready
│   └── API response caching ready
│
└── Monitoring
    ├── Performance metrics
    ├── Error tracking
    └── Analytics ready
```

---

**Last Updated: 2/22/2026**
**Version: 1.0 - MVP**
