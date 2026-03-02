'use client'

import { RefreshCcw, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfb] pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-16 border-b border-foreground/5 pb-10">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 text-primary">Refund & Return</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Ensuring integrity in healthcare equipment supply</p>
                </div>

                <div className="space-y-16">
                    <section className="grid md:grid-cols-3 gap-10">
                        <div className="md:col-span-1">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground sticky top-36">Return Eligibility</h2>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <div className="p-6 bg-white border border-foreground/5 space-y-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <RefreshCcw className="w-4 h-4" />
                                    </div>
                                    <p className="text-sm font-bold leading-relaxed">
                                        Products can be returned within 7 days of delivery only if they are received in a damaged condition, have manufacturing defects, or if the wrong item was shipped.
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 bg-white border border-foreground/5 space-y-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                    <p className="text-sm font-bold leading-relaxed">
                                        Due to hygiene and safety standards, items with broken sterile seals, used consumables, or sanitized equipment cannot be returned once opened.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid md:grid-cols-3 gap-10">
                        <div className="md:col-span-1">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground sticky top-36">Cancellation Policy</h2>
                        </div>
                        <div className="md:col-span-2">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground/60">Before Shipment</h3>
                                    <p className="text-sm font-bold text-foreground/80 leading-relaxed">
                                        Orders can be cancelled within 24 hours of placement for a full refund. Once the order has been processed for shipping, cancellation is not possible.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground/60">After Shipment</h3>
                                    <p className="text-sm font-bold text-foreground/80 leading-relaxed">
                                        Cancellations after shipment incur a 15% restocking fee plus any recovery shipping costs incurred by Satyavij Healthcare.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid md:grid-cols-3 gap-10">
                        <div className="md:col-span-1">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground sticky top-36">Process & Timelines</h2>
                        </div>
                        <div className="md:col-span-2">
                            <div className="relative">
                                <div className="absolute left-4 top-0 w-px h-full bg-foreground/10"></div>
                                <div className="space-y-12 ml-10">
                                    <div className="relative">
                                        <div className="absolute -left-[2.75rem] top-0 w-8 h-8 bg-white border-2 border-primary flex items-center justify-center text-[10px] font-black">1</div>
                                        <h4 className="text-sm font-black uppercase tracking-widest mb-2">Initiate Request</h4>
                                        <p className="text-xs font-medium text-foreground/60">Email support@satyavij.com with your Order ID and photos of the issue within 48 hours of delivery.</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[2.75rem] top-0 w-8 h-8 bg-white border-2 border-primary flex items-center justify-center text-[10px] font-black">2</div>
                                        <h4 className="text-sm font-black uppercase tracking-widest mb-2">Technical Evaluation</h4>
                                        <p className="text-xs font-medium text-foreground/60">Our technical team will review the claim. For equipment defects, a video call may be required for remote troubleshooting.</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[2.75rem] top-0 w-8 h-8 bg-white border-2 border-primary flex items-center justify-center text-[10px] font-black">3</div>
                                        <h4 className="text-sm font-black uppercase tracking-widest mb-2">Refund Processing</h4>
                                        <p className="text-xs font-medium text-foreground/60">Approved refunds will be processed to the original payment method within 5-7 business days after the item is received and inspected.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="bg-emerald-50 p-8 border border-emerald-100 flex gap-6 items-start">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-900 mb-2">Fair Use Guarantee</h3>
                            <p className="text-xs font-medium text-emerald-800 leading-relaxed">
                                At Satyavij Healthcare, we prioritize your institution's success. If an equipment failure occurs during critical operations within the warranty period, we provide priority replacement or rental assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
