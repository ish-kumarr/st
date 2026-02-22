import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this product.'],
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category.'],
    },
    subcategory: {
        type: String,
    },
    description: {
        type: String,
        required: [true, 'Please provide a short description.'],
    },
    fullDescription: {
        type: String,
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL.'],
    },
    gallery: [String],
    price: {
        type: Number,
        required: [true, 'Please provide a price.'],
    },
    originalPrice: {
        type: Number,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    stockCount: {
        type: Number,
        default: 0,
    },
    badge: String,
    badgeColor: {
        type: String,
        enum: ['emerald', 'amber', 'red', 'blue'],
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    specifications: {
        type: Map,
        of: String,
    },
    features: [String],
    certifications: [String],
    warranty: String,
    shipping: {
        free: Boolean,
        estimatedDays: String,
    },
    seller: {
        name: String,
        rating: Number,
        reviews: Number,
        responseTime: String,
    },
    returns: String,
}, {
    timestamps: true,
});

// Force model refresh in development to avoid schema caching issues
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
