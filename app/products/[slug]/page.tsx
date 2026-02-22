import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import ProductDetailClient from '@/components/product-detail-client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ProductPageProps {
    params: Promise<{
        slug: string
    }>
}

async function getProduct(slug: string) {
    try {
        await dbConnect()
        const product = await Product.findOne({ slug }).lean()
        if (!product) return null

        // Serialize MongoDB objects for client component
        return JSON.parse(JSON.stringify(product))
    } catch (error) {
        console.error('Database connection error:', error)
        return null
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center pt-32 pb-20 text-foreground">
                    <div className="text-center space-y-6 max-w-sm px-4">
                        <div className="text-6xl mb-4 opacity-20">⚠️</div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Inventory Sync Error</h1>
                        <p className="text-muted-foreground text-sm font-light leading-relaxed">
                            We couldn't synchronize clinical data for this request. The resource may have been reassigned or removed.
                        </p>
                        <Link href="/products" className="inline-block">
                            <Button variant="outline" className="h-12 px-8 font-black uppercase tracking-widest text-[10px] rounded-none border-foreground/10 hover:bg-foreground/5 transition-all">
                                Return to Catalogue
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <ProductDetailClient product={product} />
            <Footer />
        </div>
    )
}
