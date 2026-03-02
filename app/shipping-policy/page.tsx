'use client'

import { Truck, Clock, ShieldCheck, Globe } from 'lucide-react'

export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfb] pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-16">
                    <div className="w-16 h-1 bg-primary mb-8"></div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">Shipping & Delivery</h1>
                    <p className="text-foreground/60 max-w-xl font-medium tracking-tight leading-relaxed">
                        We partner with temperature-controlled logistics and medical-grade freight providers
                        to ensure your equipment arrives in perfect calibration.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 border border-foreground/5 space-y-4">
                        <Clock className="w-8 h-8 text-primary" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Processing Time</h3>
                        <p className="text-xs font-medium text-foreground/60 leading-relaxed">
                            Orders for in-stock items are typically processed within 24-48 hours. Custom medical configurations may require an additional 3-5 business days for calibration and certification.
                        </p>
                    </div>
                    <div className="bg-white p-8 border border-foreground/5 space-y-4">
                        <Truck className="w-8 h-8 text-primary" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Delivery Timelines</h3>
                        <p className="text-xs font-medium text-foreground/60 leading-relaxed">
                            Standard domestic shipping: 3-7 business days.{"\n"}
                            International institutional shipping: 10-21 business days via air freight.
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-lg font-black uppercase tracking-wider mb-6 pb-2 border-b-2 border-black inline-block">Shipping Costs</h2>
                        <div className="space-y-4">
                            <p className="text-sm font-bold leading-relaxed">
                                We offer <span className="text-emerald-600">Free PAN-India Shipping</span> for orders above ₹50,000. For orders below this threshold, shipping is calculated based on weight and distance at checkout.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-black uppercase tracking-wider mb-6 pb-2 border-b-2 border-black inline-block">Tracking Your Order</h2>
                        <p className="text-sm font-bold leading-relaxed">
                            Once your equipment leaves our warehouse, you will receive an SMS and email with a real-time tracking link and a copy of the digitised delivery challan.
                        </p>
                    </section>

                    <section className="p-10 border-2 border-black bg-white space-y-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Medical-Grade Packaging</h3>
                        </div>
                        <p className="text-xs font-medium text-foreground/60 leading-relaxed">
                            Every heavy equipment unit (Ventilators, ICU Beds, Imaging Systems) is shipped in 5-ply reinforced crating with shock-watch sensors. If the shock-watch sensor is triggered (red) upon arrival, please refuse delivery and contact us immediately.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 rounded-full">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                <span className="text-[9px] font-black uppercase tracking-widest">Insured</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 rounded-full">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                <span className="text-[9px] font-black uppercase tracking-widest">Tamper-Proof</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 rounded-full">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                <span className="text-[9px] font-black uppercase tracking-widest">Calibrated Delivery</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
