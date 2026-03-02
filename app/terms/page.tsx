'use client'

import { ShieldCheck, Scale, FileText, Gavel } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfb] pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-16 border-b border-foreground/5 pb-10">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">Terms & Conditions</h1>
                    <div className="flex items-center gap-4 text-foreground/40">
                        <span className="text-[10px] font-black uppercase tracking-widest">Last Updated: March 2, 2026</span>
                        <div className="w-1 h-1 bg-foreground/20 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Version 2.0</span>
                    </div>
                </div>

                <div className="space-y-12 prose prose-sm max-w-none">
                    <section>
                        <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-wider mb-6">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">1</div>
                            Introduction
                        </h2>
                        <p className="text-sm text-foreground/70 leading-relaxed font-medium mb-4">
                            Welcome to Satyavij Healthcare. These Terms & Conditions govern your use of our website located at satyavij.com and your purchase of medical equipment from Satyavij Healthcare Pvt. Ltd.
                        </p>
                        <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                            By accessing this website and/or purchasing products, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service or purchase products.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-wider mb-6">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">2</div>
                            Eligibility
                        </h2>
                        <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                            Our products are intended for use by healthcare professionals, medical institutions, and qualified individuals. By placing an order, you represent that you have the necessary qualifications or authority to use the medical equipment purchased.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-wider mb-6">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">3</div>
                            Product Information & Pricing
                        </h2>
                        <ul className="list-none space-y-4 p-0">
                            <li className="flex gap-4 items-start bg-white p-4 border border-foreground/5">
                                <FileText className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                                <span className="text-xs font-semibold leading-relaxed">We strive for accuracy, but we do not warrant that product descriptions or other content is error-free. Prices are subject to change without notice.</span>
                            </li>
                            <li className="flex gap-4 items-start bg-white p-4 border border-foreground/5">
                                <Scale className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                                <span className="text-xs font-semibold leading-relaxed">All medical specifications provided are as per the manufacturer's data. Satyavij Healthcare does not modify or alter technical specifications.</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-wider mb-6">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">4</div>
                            Payment & Security
                        </h2>
                        <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                            Payment must be made in full at the time of purchase unless otherwise agreed (e.g., COD). We use secure third-party payment gateways (Razorpay/Cashfree). We do not store your credit card or financial information on our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-wider mb-6">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">5</div>
                            Limitation of Liability
                        </h2>
                        <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                            Satyavij Healthcare Pvt. Ltd. shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the medical equipment. Users must follow all safety protocols and manufacturer guidelines provided with the equipment.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-wider mb-6">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">6</div>
                            Governing Law
                        </h2>
                        <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                            These Terms shall be governed and construed in accordance with the laws of Haryana, India, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section className="bg-black text-white p-10 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Compliance Confirmation</h3>
                        </div>
                        <p className="text-xs font-medium text-white/70 leading-relaxed">
                            These terms are designed to protect both the provider and the user. If you have any questions regarding our terms, please contact our legal department at legal@satyavij.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
