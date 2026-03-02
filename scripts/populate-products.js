const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    category: String,
    hsnCode: String,
    gstPercentage: Number,
    description: String,
    fullDescription: String,
    image: String,
    price: Number,
    originalPrice: Number,
    stockCount: Number,
    inStock: Boolean,
    slug: { type: String, unique: true },
    shipping: {
        free: Boolean,
        estimatedDays: String,
    }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const products = [
    // Masks & Gloves
    {
        name: '3-Ply Face Mask (50 pcs Box)',
        category: 'Masks & Gloves',
        hsnCode: '63079090',
        gstPercentage: 5,
        price: 500,
        description: 'High-quality 3-ply surgical masks for daily protection.',
        slug: '3-ply-face-mask-50pcs'
    },
    {
        name: 'Latex Examination Gloves (100 pcs Box)',
        category: 'Masks & Gloves',
        hsnCode: '40151100',
        gstPercentage: 12,
        price: 1800,
        description: 'Powder-free latex examination gloves for clinical use.',
        slug: 'latex-exam-gloves-100pcs'
    },
    {
        name: 'Nitrile Gloves (100 pcs Box)',
        category: 'Masks & Gloves',
        hsnCode: '40151900',
        gstPercentage: 12,
        price: 2500,
        description: 'Durable nitrile gloves for superior protection and sensitivity.',
        slug: 'nitrile-gloves-100pcs'
    },
    // Rapid Test Kits
    {
        name: 'HCV Rapid Test (1 Test)',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 350,
        description: 'Rapid diagnostic test for Hepatitis C Virus.',
        slug: 'hcv-rapid-test'
    },
    {
        name: 'Troponin-I Rapid Test',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 700,
        description: 'Cardiac biomarker test for rapid diagnosis of myocardial infarction.',
        slug: 'troponin-i-rapid-test'
    },
    {
        name: 'HBsAg Rapid Test',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 250,
        description: 'Rapid test for Hepatitis B surface antigen.',
        slug: 'hbsag-rapid-test'
    },
    {
        name: 'Malaria Pf/Pv Rapid Test',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 300,
        description: 'Rapid diagnostic test for Malaria Plasmodium falciparum and vivax.',
        slug: 'malaria-rapid-test'
    },
    {
        name: 'HIV Rapid Test',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 400,
        description: 'Rapid screening test for HIV antibodies.',
        slug: 'hiv-rapid-test'
    },
    {
        name: 'COVID-19 Antigen Rapid Test',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 600,
        description: 'Fast and reliable antigen test for COVID-19 detecting SARS-CoV-2.',
        slug: 'covid-antigen-rapid-test'
    },
    {
        name: 'D-Dimer Rapid Test',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 900,
        description: 'Rapid quantification of D-Dimer for thrombosis screening.',
        slug: 'd-dimer-rapid-test'
    },
    {
        name: 'PSA Rapid Test',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 900,
        description: 'Prostate-Specific Antigen test for prostate health monitoring.',
        slug: 'psa-rapid-test'
    },
    {
        name: 'Typhoid Rapid Test',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 350,
        description: 'Rapid test for Salmonella typhi antibodies.',
        slug: 'typhoid-rapid-test'
    },
    {
        name: 'CRP Rapid Test',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 800,
        description: 'C-Reactive Protein test for inflammation assessment.',
        slug: 'crp-rapid-test'
    },
    {
        name: 'Dengue NS1/IgG/IgM Rapid Test',
        category: 'Rapid Test Kits',
        hsnCode: '38220090',
        gstPercentage: 12,
        price: 600,
        description: 'Comprehensive rapid test for Dengue virus detection.',
        slug: 'dengue-combo-test'
    },
    // Medical Equipment
    {
        name: 'Hematology Analyzer (5 Part, Fully Auto)',
        category: 'Medical Equipments',
        hsnCode: '9027',
        gstPercentage: 18,
        price: 1500000,
        description: 'Advanced 5-part differential hematology analyzer for high-precision blood analysis.',
        slug: 'hematology-analyzer-5part'
    },
    {
        name: 'Fully Automatic Biochemistry Analyzer',
        category: 'Medical Equipments',
        hsnCode: '9027',
        gstPercentage: 18,
        price: 2500000,
        description: 'High-throughput biochemistry analyzer for large laboratories.',
        slug: 'biochemistry-analyzer-auto'
    },
    {
        name: 'Semi Auto Biochemistry Analyzer',
        category: 'Medical Equipments',
        hsnCode: '9027',
        gstPercentage: 18,
        price: 300000,
        description: 'Compact and reliable semi-automatic biochemistry analyzer.',
        slug: 'biochemistry-analyzer-semi'
    },
    {
        name: 'Electrolyte Analyzer (ISE Advanced)',
        category: 'Medical Equipments',
        hsnCode: '9027',
        gstPercentage: 18,
        price: 600000,
        description: 'Precision ISE electrolyte analyzer for ion concentration measurement.',
        slug: 'electrolyte-analyzer'
    },
    {
        name: 'ELISA Reader + Washer Combo',
        category: 'Medical Equipments',
        hsnCode: '9027',
        gstPercentage: 18,
        price: 900000,
        description: 'Integrated ELISA screening system with high-speed reader and washer.',
        slug: 'elisa-combo'
    },
    {
        name: 'Refrigerated Centrifuge',
        category: 'Medical Equipments',
        hsnCode: '8421',
        gstPercentage: 18,
        price: 500000,
        description: 'High-speed refrigerated centrifuge for temperature-sensitive samples.',
        slug: 'refrigerated-centrifuge'
    },
    {
        name: 'Research Grade Micropipette Set',
        category: 'Medical Equipments',
        hsnCode: '9018',
        gstPercentage: 18,
        price: 100000,
        description: 'Variable volume research-grade micropipettes for accurate liquid handling.',
        slug: 'micropipette-set'
    },
    {
        name: 'CO2 Laboratory Incubator',
        category: 'Medical Equipments',
        hsnCode: '8419',
        gstPercentage: 18,
        price: 1000000,
        description: 'Advanced CO2 incubator for cell culture and microbiological research.',
        slug: 'co2-incubator'
    },
    {
        name: 'Hot Air Oven (Large Capacity)',
        category: 'Medical Equipments',
        hsnCode: '8419',
        gstPercentage: 18,
        price: 350000,
        description: 'Digital hot air oven for sterilization and industrial applications.',
        slug: 'hot-air-oven'
    },
    {
        name: 'Digital Trinocular Microscope',
        category: 'Medical Equipments',
        hsnCode: '9011',
        gstPercentage: 18,
        price: 800000,
        description: 'Professional research microscope with trinocular head and digital imaging.',
        slug: 'digital-microscope'
    },
    {
        name: 'Fully Automatic Autoclave',
        category: 'Medical Equipments',
        hsnCode: '8419',
        gstPercentage: 18,
        price: 1200000,
        description: 'Horizontal fully automatic autoclave for medical sterilization.',
        slug: 'auto-autoclave'
    },
    {
        name: 'Blood Collection Monitor',
        category: 'Medical Equipments',
        hsnCode: '9018',
        gstPercentage: 18,
        price: 400000,
        description: 'Advanced blood collection monitor for precision sampling.',
        slug: 'blood-monitor'
    },
    {
        name: 'RT-PCR Machine (Real Time)',
        category: 'Medical Equipments',
        hsnCode: '9027',
        gstPercentage: 18,
        price: 3500000,
        description: 'High-sensitivity real-time PCR machine for molecular diagnostics.',
        slug: 'rt-pcr-machine'
    },
    {
        name: 'Clinical Chemistry Analyzer',
        category: 'Medical Equipments',
        hsnCode: '9027',
        gstPercentage: 18,
        price: 5000000,
        description: 'High-capacity clinical chemistry analyzer for comprehensive profiling.',
        slug: 'clinical-chemistry-analyzer'
    }
];

async function main() {
    await mongoose.connect('mongodb+srv://vijay:Vijay123123123@shoppingv1.eqzgayt.mongodb.net/?appName=shoppingv1');

    const imageUrl = '/uploads/products/1771779916545-413217572.png';

    for (const p of products) {
        await Product.findOneAndUpdate(
            { slug: p.slug },
            {
                ...p,
                image: imageUrl,
                gallery: [imageUrl],
                fullDescription: p.description + ' Premium quality products for clinical and laboratory use.',
                stockCount: 100,
                inStock: true,
                originalPrice: p.price * 1.2, // dummy market price
                shipping: { free: false, estimatedDays: '3-5 Days' }
            },
            { upsert: true, new: true }
        );
        console.log(`Updated/Created: ${p.name}`);
    }

    console.log('Finished populating products.');
    mongoose.disconnect();
}

main().catch(console.error);
