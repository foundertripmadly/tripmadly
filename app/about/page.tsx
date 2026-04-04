'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Globe, Heart, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { icon: <Globe className="text-indigo-600" />, title: 'Global Reach', desc: 'Connecting travelers to every corner of the world.' },
    { icon: <Heart className="text-pink-600" />, title: 'Passion First', desc: 'We love travel as much as you do, and it shows.' },
    { icon: <Shield className="text-emerald-600" />, title: 'Safe & Secure', desc: 'Your data and bookings are protected by industry standards.' },
    { icon: <Zap className="text-amber-600" />, title: 'AI-Powered', desc: 'Using cutting-edge technology to simplify planning.' },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Redefining the <br />
              <span className="text-indigo-600">Future of Travel.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              TripMadly was born from a simple idea: that travel planning should be as exciting as the trip itself. We combine artificial intelligence with human curiosity to create experiences that are truly unique.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-bold text-slate-900">50k+</p>
                <p className="text-slate-600 text-sm">Trips Planned</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900">190+</p>
                <p className="text-slate-600 text-sm">Countries Covered</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
              <Image src="/images/about/about.jpg" alt="Team" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl space-y-2 max-w-xs">
              <p className="text-indigo-600 font-bold italic">&quot;Our mission is to make every journey a masterpiece of memories.&quot;</p>
              <p className="text-sm font-bold text-slate-900">— The TripMadly Team</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-lg shadow-slate-200/50 space-y-6"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                  {v.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">{v.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
