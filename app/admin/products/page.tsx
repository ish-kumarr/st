'use client'

import React, { useState, useEffect } from 'react'
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Package,
    AlertCircle,
    X,
    Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function InventoryPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [formData, setFormData] = useState<any>({
        name: '',
        category: '',
        description: '',
        fullDescription: '',
        price: '',
        originalPrice: '',
        stockCount: '',
        inStock: true,
        image: '',
        badge: '',
        badgeColor: 'emerald',
        slug: '',
        rating: 0,
        reviews: 0
    })

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/products')
            const data = await res.json()
            if (data.success) setProducts(data.products)
        } catch (error) {
            toast.error('Failed to load inventory.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleOpenForm = (product: any = null) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                name: product.name,
                category: product.category,
                description: product.description,
                fullDescription: product.fullDescription || '',
                price: product.price,
                originalPrice: product.originalPrice || '',
                stockCount: product.stockCount,
                inStock: product.inStock ?? true,
                image: product.image,
                badge: product.badge || '',
                badgeColor: product.badgeColor || 'emerald',
                slug: product.slug || '',
                rating: product.rating || 0,
                reviews: product.reviews || 0
            })
        } else {
            setEditingProduct(null)
            setFormData({
                name: '',
                category: '',
                description: '',
                fullDescription: '',
                price: '',
                originalPrice: '',
                stockCount: '',
                inStock: true,
                image: '',
                badge: '',
                badgeColor: 'emerald',
                slug: '',
                rating: 0,
                reviews: 0
            })
        }
        setIsFormOpen(true)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                setFormData((prev: any) => ({ ...prev, image: data.url }))
                toast.success('Image uploaded successfully')
            } else {
                toast.error(data.error || 'Failed to upload image')
            }
        } catch (error) {
            toast.error('Error uploading image.')
        } finally {
            setUploadingImage(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = editingProduct ? 'PUT' : 'POST'
        const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : '/api/admin/products'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                    stockCount: Number(formData.stockCount),
                    rating: Number(formData.rating),
                    reviews: Number(formData.reviews)
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(editingProduct ? 'Product Updated' : 'Product Created')
                setIsFormOpen(false)
                fetchProducts()
            } else {
                toast.error(data.error || 'Operation failed')
            }
        } catch (error) {
            toast.error('Error saving product.')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                toast.success('Product Deleted')
                fetchProducts()
            }
        } catch (error) {
            toast.error('Failed to delete product.')
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 text-foreground">Inventory</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Manage your product catalog and stock levels</p>
                </div>
                <Button
                    onClick={() => handleOpenForm()}
                    className="h-14 px-8 bg-black text-white hover:bg-primary font-black uppercase tracking-widest text-[10px] rounded-none shadow-2xl transition-all flex items-center gap-3"
                >
                    <Plus className="h-4 w-4" />
                    Add New Product
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-8 bg-white border border-foreground/[0.05]">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="SEARCH BY NAME OR CATEGORY..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-none border border-foreground/10 bg-[#fbfbfb] focus:outline-none focus:border-black text-[9px] font-black uppercase tracking-widest transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-none border-foreground/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-foreground/[0.01]">
                        <Filter className="h-4 w-4 opacity-40" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-foreground/[0.05] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#fcfcfc] border-b border-foreground/[0.05]">
                                <tr>
                                    {['Product', 'Category', 'Price (INR)', 'Stock', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-foreground/30">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/[0.03]">
                                {filteredProducts.map((p) => (
                                    <tr key={p._id} className="hover:bg-foreground/[0.01] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-[#fbfbfb] border border-foreground/[0.05] flex-shrink-0 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-500">
                                                    <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                                                    <p className="text-[9px] text-foreground/40 mt-1 uppercase truncate max-w-[200px]">{p.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">{p.category}</span>
                                        </td>
                                        <td className="px-8 py-6 text-[11px] font-black text-foreground">₹{p.price.toLocaleString()}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 leading-none">Stock</span>
                                                <span className="text-[10px] font-black text-foreground">{p.stockCount} Units</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border ${p.stockCount > 0 ? 'border-emerald-500/20 text-emerald-500 bg-emerald-50/50' : 'border-red-500/20 text-red-500 bg-red-50/50'
                                                }`}>
                                                {p.stockCount > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenForm(p)}
                                                    className="p-3 bg-foreground/[0.03] hover:bg-black hover:text-white transition-all border border-foreground/[0.05]"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p._id)}
                                                    className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Product Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-2xl shadow-2xl border border-foreground/[0.05] overflow-y-auto max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-foreground/[0.05] bg-[#fbfbfb] flex justify-between items-center sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">{editingProduct ? 'Update Product' : 'Add New Product'}</h2>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-2">Enter product details and stock information</p>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-4 hover:bg-foreground/[0.05] transition-colors border border-foreground/[0.05]">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Product Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-bold uppercase"
                                            placeholder="E.G. APOLLO VX SERIES..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Slug</label>
                                        <input
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full px-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-bold uppercase"
                                            placeholder="Auto-generated if empty"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Category</label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-bold uppercase bg-transparent"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Diagnostics">Diagnostics</option>
                                            <option value="Surgical">Surgical</option>
                                            <option value="Emergency">Emergency</option>
                                            <option value="Imaging">Imaging</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Display Badge (Optional)</label>
                                        <div className="flex gap-4">
                                            <input
                                                value={formData.badge}
                                                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                                className="w-full px-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-bold uppercase"
                                                placeholder="NEW, FEATURED..."
                                            />
                                            <select
                                                value={formData.badgeColor}
                                                onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                                                className="w-32 px-4 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-bold uppercase bg-transparent"
                                            >
                                                <option value="emerald">Emerald</option>
                                                <option value="amber">Amber</option>
                                                <option value="red">Red</option>
                                                <option value="blue">Blue</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Short Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-medium h-20 resize-none"
                                        placeholder="A brief summary for cards..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Full Description</label>
                                    <textarea
                                        value={formData.fullDescription}
                                        onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                                        className="w-full px-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-medium h-32 resize-none"
                                        placeholder="Enter the detailed product specification and overview..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Price (INR)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[11px] font-black">₹</span>
                                            <input
                                                type="number"
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full pl-10 pr-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-black"
                                                placeholder="99000"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Original Price (INR) - Optional</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[11px] font-black">₹</span>
                                            <input
                                                type="number"
                                                value={formData.originalPrice}
                                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                                className="w-full pl-10 pr-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-black"
                                                placeholder="Crossed out price"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Stock Amount</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.stockCount}
                                            onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                                            className="w-full px-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-black"
                                            placeholder="50"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Rating (0-5)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.rating}
                                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                            className="w-full px-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-black"
                                            placeholder="4.8"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Total Reviews</label>
                                        <input
                                            type="number"
                                            value={formData.reviews}
                                            onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                                            className="w-full px-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-black"
                                            placeholder="124"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.inStock}
                                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                        className="w-4 h-4 rounded-sm border-foreground/10 accent-black"
                                        id="inStock"
                                    />
                                    <label htmlFor="inStock" className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Currently In Stock (Visible to Users)</label>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Product Image</label>
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                                className="w-full px-6 py-4 rounded-none border border-foreground/10 focus:outline-none focus:border-black text-[11px] font-medium file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:font-black file:bg-black file:text-white hover:file:bg-primary file:cursor-pointer transition-all"
                                            />
                                        </div>
                                        {uploadingImage && <Loader2 className="h-5 w-5 animate-spin text-primary flex-shrink-0" />}
                                    </div>
                                    {formData.image && !uploadingImage && (
                                        <div className="mt-2 text-[10px] text-emerald-600 font-bold uppercase truncate">
                                            ✓ Image URL: {formData.image}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-primary transition-all shadow-2xl">
                                    {editingProduct ? 'Save Changes' : 'Add Product'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
