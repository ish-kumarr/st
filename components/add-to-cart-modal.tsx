'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AddToCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        name: string;
        price: number;
        image: string;
    };
    quantity: number;
}

export function AddToCartModal({ isOpen, onClose, product, quantity }: AddToCartModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background border border-foreground/10 z-[101] overflow-hidden"
                    >
                        <div className="p-8 space-y-8">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-primary">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Added to Cart</span>
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">Clinical Selection Updated</h2>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-foreground/5 transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="flex gap-6 p-6 bg-foreground/[0.02] border border-foreground/[0.05]">
                                <div className="w-24 h-24 bg-white border border-foreground/10 flex-shrink-0 flex items-center justify-center p-2">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center space-y-2">
                                    <h3 className="font-black uppercase tracking-tighter text-lg leading-none">{product.name}</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Quantity: {quantity} • Total: ${(product.price * quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="h-14 rounded-none border-foreground/10 font-black uppercase tracking-widest text-[10px] hover:bg-foreground/5 transition-all text-muted-foreground"
                                >
                                    Continue Browsing
                                </Button>
                                <Link href="/checkout" className="w-full">
                                    <Button
                                        className="w-full h-14 rounded-none bg-black text-white hover:bg-primary font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
