'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Star, ShieldCheck, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: any = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8 },
    },
  }

  const imageVariants: any = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.5 },
    },
  }



  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background pt-20">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1.2 }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-secondary blur-[100px]"
        />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col items-center text-center gap-8">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 backdrop-blur-sm">
              <Heart className="h-4 w-4 text-primary fill-primary/20" />
              <span className="text-sm font-medium tracking-tight text-primary uppercase">Innovation in Healthcare</span>
            </motion.div>

            <motion.div variants={itemVariants} className="max-w-4xl">
              <h1 className="text-5xl font-black tracking-tighter md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] text-foreground uppercase">
                Redefining <span className="text-stroke">Medical</span> <br />
                <span className="relative">
                  Excellence
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="absolute bottom-2 left-0 h-2 bg-primary/20 -z-10"
                  />
                </span>
              </h1>
            </motion.div>

            <motion.p variants={itemVariants} className="max-w-2xl text-lg text-muted-foreground md:text-xl font-light leading-relaxed">
              Experience the next generation of healthcare technology. Satyavij delivers high-precision medical solutions designed for professionals who demand nothing but the absolute best.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="h-16 px-10 text-base font-black rounded-none bg-foreground text-background hover:translate-y-[-4px] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative group overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  DISCOVER EQUIPMENT
                  <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" />
                </span>
                <motion.div
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-primary z-0"
                />
              </Button>

              <Button size="lg" variant="outline" className="h-16 px-10 text-base font-black rounded-none border-foreground/10 hover:border-foreground transition-all duration-500 relative group overflow-hidden">
                <span className="relative z-10 group-hover:text-background transition-colors duration-500">PARTNER WITH US</span>
                <motion.div
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-foreground z-0"
                />
              </Button>
            </motion.div>

          </div>

          {/* Dynamic Grid Layout for Images/Stats */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-12 pb-20">
            <motion.div
              variants={imageVariants}
              className="md:col-span-8 relative h-[400px] md:h-[600px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 group cursor-crosshair"
            >
              <Image
                src="/images/hero-medical.jpg"
                alt="State of the art medical facility"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <p className="text-2xl font-black text-foreground">FUTURE-READY CLINICS</p>
                <p className="text-sm text-muted-foreground">Integrating AI and advanced robotics into daily healthcare.</p>
              </div>
            </motion.div>

            <div className="md:col-span-4 flex flex-col gap-6">
              <motion.div
                variants={itemVariants}
                className="bg-secondary/5 border border-secondary/10 p-8 flex flex-col justify-between h-full hover:bg-secondary/10 transition-colors duration-300"
              >
                <div className="flex flex-col gap-4">
                  <Star className="h-8 w-8 text-secondary fill-secondary/20" />
                  <h3 className="text-4xl font-black text-secondary">500+</h3>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Medical products approved by global standards</p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-primary/5 border border-primary/10 p-8 flex flex-col justify-between h-full hover:bg-primary/10 transition-colors duration-300"
              >
                <div className="flex flex-col gap-4">
                  <Globe className="h-8 w-8 text-primary fill-primary/20" />
                  <h3 className="text-4xl font-black text-primary">15+</h3>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Years of pioneering healthcare innovation</p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-zinc-900 text-white p-8 flex flex-col justify-between h-full"
              >
                <div className="flex flex-col gap-4">
                  <ShieldCheck className="h-8 w-8 text-white/50" />
                  <h3 className="text-4xl font-black">100%</h3>
                  <p className="text-sm font-medium text-white/60 uppercase tracking-widest">Trust and reliability in every specialized equipment</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Static Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  )
}

