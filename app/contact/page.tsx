'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ContactPage() {
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        toast.success('Message sent successfully!')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setSubmitting(false)
    }

    return (
        <div className="min-h-screen bg-[#fbfbfb] pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="mb-16">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Contact Us</h1>
                    <p className="text-foreground/60 max-w-2xl font-medium tracking-tight">
                        Have questions about our medical equipment or need a custom quote for your institution?
                        Our team is here to assist you with technical specifications and bulk ordering.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-12">
                        <section className="space-y-8">
                            <div className="flex gap-6 group">
                                <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-foreground/40">Registered Office</h3>
                                    <p className="text-sm font-bold leading-relaxed whitespace-pre-line">
                                        SATYAVIJ HEALTH CARE PRIVATE LIMITED{"\n"}
                                        Gali No-1, Devi Lal Colony, Mehalana Road,{"\n"}
                                        Sonipat, Haryana – 131001, India
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 group">
                                <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-foreground/40">Phone</h3>
                                    <p className="text-sm font-bold">+91 98178 82309</p>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-foreground/30 mt-1">Mon - Sat, 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>

                            <div className="flex gap-6 group">
                                <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-foreground/40">Email</h3>
                                    <p className="text-sm font-bold">info@satyavij.com</p>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-foreground/30 mt-1">Expected response: 24-48 hours</p>
                                </div>
                            </div>
                        </section>

                        <div className="p-8 border border-foreground/5 bg-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">Support Hours</h4>
                            <p className="text-xs font-medium text-foreground/60 leading-relaxed italic">
                                "We understand the critical nature of medical supplies. For emergency institutional orders, please contact our priority hotline."
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="bg-white p-10 border border-foreground/5 space-y-8 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-[#fbfbfb]"
                                        placeholder="Dr. John Smith"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-[#fbfbfb]"
                                        placeholder="john@hospital.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Subject</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-[#fbfbfb]"
                                    placeholder="Bulk Order Inquiry"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-[#fbfbfb] resize-none"
                                    placeholder="Tell us about your requirements..."
                                />
                            </div>

                            <button
                                disabled={submitting}
                                className="w-full bg-black text-white h-16 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.3em] hover:bg-primary transition-all group disabled:opacity-50"
                            >
                                {submitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Send Message <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
