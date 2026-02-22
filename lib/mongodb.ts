import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vijay:Vijay123123123@shoppingv1.eqzgayt.mongodb.net/?appName=shoppingv1';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
            connectTimeoutMS: 10000,        // 10 seconds timeout for initial connection
            socketTimeoutMS: 45000,         // 45 seconds timeout for idle sockets
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB connected successfully');
            return mongoose;
        }).catch((err) => {
            console.error('MongoDB connection error:', err);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
