import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-w ]+/g, '')
        .replace(/ +/g, '-')
        .replace(/^-+|-+$/g, '')
}

const professionalProducts = [
    {
        name: 'Apollo V-Series Digital Stethoscope',
        slug: 'apollo-v-series-digital-stethoscope',
        category: 'Diagnostic',
        description: 'The pinnacle of acoustic precision. Features active noise cancellation and digital sound amplification up to 40x for ultra-faint heart sounds.',
        price: 349,
        originalPrice: 399,
        inStock: true,
        rating: 4.9,
        badge: 'Best Seller',
        image: '/products/stethoscope.png',
        features: [
            'Active Noise Cancellation',
            '40x Sound Amplification',
            'Bluetooth Mobile App Integration',
            '8-Hour Rechargeable Battery'
        ],
        specifications: {
            'Transducer': 'Piezo-electric Crystal',
            'Amplification': 'Up to 40x',
            'Frequency Range': '20Hz - 2000Hz',
            'Battery Life': '8 Hours Continuous'
        }
    },
    {
        name: 'PrecisionPro O2 Monitor',
        slug: 'precisionpro-o2-monitor',
        category: 'Monitoring',
        description: 'Hospital-grade pulse oximetry for critical care. Real-time SpO2 and pulse rate monitoring with clinical-level accuracy.',
        price: 69,
        originalPrice: 89,
        inStock: true,
        rating: 4.7,
        badge: 'Essential',
        image: '/products/oximeter.png',
        features: [
            'OLED Multi-Direction Display',
            'Hypoperfusion Accuracy',
            'Audible Alarm Alerts',
            'Compact & Durable Design'
        ],
        specifications: {
            'SpO2 Range': '0% - 100%',
            'Pulse Rate Range': '30bpm - 250bpm',
            'Accuracy': '±2% (70-100%)',
            'Display': 'Dual-color OLED'
        }
    },
    {
        name: 'OmniBP Smart Sphygmomanometer',
        slug: 'omnibp-smart-sphygmomanometer',
        category: 'Monitoring',
        description: 'Clinical accuracy for the modern clinic. Intelligent inflation technology provides the fastest and most comfortable measurement available.',
        price: 129,
        inStock: true,
        rating: 4.8,
        image: '/products/bp-monitor.png',
        features: [
            'Intelligent Inflation Tech',
            'Irregular Heartbeat Detection',
            'Multi-User Memory (200 Logs)',
            'Clinical Validation for Accuracy'
        ],
        specifications: {
            'Pressure Range': '0 - 299 mmHg',
            'Pulse Range': '40 - 180 beats/min',
            'Memory': '200 measurements',
            'Power': '4 AA Batteries or AC Adapter'
        }
    },
    {
        name: 'FlowGuard Infusion Station',
        slug: 'flowguard-infusion-station',
        category: 'Treatment',
        description: 'Programmable multi-channel infusion pump system designed for the highest level of patient safety and drug delivery precision.',
        price: 1899,
        originalPrice: 2100,
        inStock: true,
        rating: 5.0,
        badge: 'Pro Choice',
        image: '/products/iv-pump.png',
        features: [
            'Dose Error Reduction System',
            'Touchscreen Color Interface',
            'Wireless EMR Connectivity',
            'Long-Life Emergency Battery'
        ],
        specifications: {
            'Flow Rate': '0.1 - 1200 mL/h',
            'Accuracy': '±2%',
            'Alarms': 'Occlusion, Air-in-line, Door Open',
            'Battery': 'Rechargeable Li-ion, 6 hours'
        }
    },
    {
        name: 'Vitalis 12 Multi-Param Monitor',
        slug: 'vitalis-12-multi-param-monitor',
        category: 'Monitoring',
        description: 'Comprehensive vital signs tracking with a high-resolution 12-inch display. Perfect for surgical suites and intensive care units.',
        price: 2999,
        inStock: true,
        rating: 4.9,
        image: '/products/patient-monitor.png',
        features: [
            '12.1-inch High-Res Display',
            'Real-time ECG & Waveforms',
            'Arterial Blood Pressure Module',
            'Waterproof Antimicrobial Shell'
        ],
        specifications: {
            'Screen': '12.1 inch TFT LCD',
            'Parameters': 'ECG, SpO2, NIBP, TEMP, RESP',
            'Trending': '168 hours',
            'Network': 'Wired/Wireless CMS'
        }
    },
    {
        name: 'Z-Shock 360 Defibrillator',
        slug: 'z-shock-360-defibrillator',
        category: 'Emergency',
        description: 'Advanced AED and manual defibrillator in one compact unit. Features real-time CPR feedback and rapid-shock technology.',
        price: 4500,
        inStock: true,
        rating: 4.8,
        badge: 'Critical Life',
        image: '/products/defibrillator.png',
        features: [
            'Manual & AED Hybrid Modes',
            'Real-time CPR Coaching',
            'Internal & External Pacing',
            'Rugged IP55 Weatherproof'
        ],
        specifications: {
            'Energy Output': '2J - 360J',
            'Charge Time': '< 5 seconds',
            'Display': '8.4 inch High-Res',
            'Waveform': 'Biphasic Truncated Exponential'
        }
    },
    {
        name: 'Lumax Surgical LED Array',
        slug: 'lumax-surgical-led-array',
        category: 'Surgical',
        description: 'Shadowless operating illumination. High-CRI LED technology ensures natural color representation for precise surgical procedures.',
        price: 3200,
        originalPrice: 3500,
        inStock: true,
        rating: 4.9,
        image: '/products/surgical-light.png',
        features: [
            'Shadowless Optics',
            'Cool-LED Temperature Control',
            'Adjustable Color Temperature',
            '360-Degree Fluid Motion Arm'
        ],
        specifications: {
            'Illumination': '160,000 Lux',
            'CRI': '95+',
            'LED Life': '> 50,000 hours',
            'Head Diameter': '700mm'
        }
    },
    {
        name: 'Ultravue G2 Ultrasound System',
        slug: 'ultravue-g2-ultrasound-system',
        category: 'Imaging',
        description: 'Portable yet powerful. The G2 delivers crystal-clear diagnostic imaging for cardiology, obstetrics, and general radiology.',
        price: 8500,
        inStock: false,
        rating: 4.7,
        badge: 'Pre-Order',
        image: '/products/ultrasound.png',
        features: [
            'Crystal-Clear 4D Imaging',
            'AI-Assisted Measurements',
            '2-Hour Mobile Operation',
            'DICOM Standard Integration'
        ],
        specifications: {
            'Imaging Modes': 'B, M, Color, PDI, PW',
            'Monitor': '15 inch Medical Grade',
            'Probe Ports': '3 Active Ports',
            'Storage': '500GB SSD'
        }
    }
]

export async function GET() {
    try {
        await dbConnect()

        // Clear existing products
        await Product.deleteMany({})

        // Ensure all products have slugs (double check)
        const productsToSeed = professionalProducts.map(p => ({
            ...p,
            slug: p.slug || generateSlug(p.name)
        }))

        // Insert new products
        const seededProducts = await Product.insertMany(productsToSeed)

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully with professional imagery and slugs',
            count: seededProducts.length,
            data: seededProducts
        })
    } catch (error: any) {
        console.error('Seeding error:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to seed database'
        }, { status: 500 })
    }
}
