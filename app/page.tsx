'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Calendar, 
  Wallet, 
  Sparkles, 
  Download, 
  Lock,
  ChevronRight,
  Globe,
  Star,
  Compass
} from 'lucide-react';
import Image from 'next/image';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TripData } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import Link from "next/link";



const WONDERS = [
  { name: "Taj Mahal", location: "India", image: "/images/wonders/taj-mahal.jpg" },
  { name: "Petra", location: "Jordan", image: "/images/wonders/petra.jpg" },
  { name: "Colosseum", location: "Italy", image: "/images/wonders/colosseum.jpg" },
  { name: "Machu Picchu", location: "Peru", image: "/images/wonders/machu-picchu.jpg" },
  { name: "Chichén Itzá", location: "Mexico", image: "/images/wonders/chichen-itza.jpg" },
  { name: "Great Wall of China", location: "China", image: "/images/wonders/great-wall.jpg" },
  { name: "Christ the Redeemer", location: "Brazil", image: "/images/wonders/christ-redeemer.jpg" },
];

const SHOWCASE_WONDERS = [
  WONDERS[4], // Chichén Itzá
  WONDERS[5], // Great Wall
  WONDERS[6], // Christ Redeemer
  WONDERS[0], // Taj Mahal
  WONDERS[1], // Petra
  WONDERS[2], // Colosseum
  WONDERS[3], // Machu Picchu
];

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profile);
      }
    };
    fetchUser();
  }, []);

  const generateTrip = async (params: { destination: string; days: string; budget: string }) => {
    if (!user) {
      setError("Please login to generate a trip.");
      return;
    }

    const isTrialActive = profile?.trial_end ? new Date(profile.trial_end) > new Date() : false;
    const hasAccess = profile?.active_subscription || isTrialActive;

    if (!hasAccess) {
      setError("Please subscribe to generate a trip.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(params)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Trip generation failed");
        }

        setTripData(data);

    } catch (err) {
      setError("Failed to generate trip. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero with Wonders Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest"
            >
              <Sparkles size={14} /> AI-Powered Travel Planning
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Your Dream Trip, <br />
              <span className="gradient-text">Perfectly Planned.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              Experience the world like never before. TripMadly uses advanced AI to craft personalized itineraries, find the best stays, places and unlock exclusive deals.
            </p>
            <div className="flex items-center gap-6">
              <Link 
              href="/planner"
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
              >
              Start Planning
              </Link>
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                    <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="user" fill className="object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">+2k</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="space-y-4"
              >
                <div className="h-64 rounded-3xl overflow-hidden relative shadow-2xl">
                  <Image src={WONDERS[0].image} alt={WONDERS[0].name} fill className="object-cover" />
                  <div className="absolute bottom-4 left-4 text-white font-bold text-sm">{WONDERS[0].name}</div>
                </div>
                <div className="h-48 rounded-3xl overflow-hidden relative shadow-2xl">
                  <Image src={WONDERS[1].image} alt={WONDERS[1].name} fill className="object-cover" />
                  <div className="absolute bottom-4 left-4 text-white font-bold text-sm">{WONDERS[1].name}</div>
                </div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="space-y-4 pt-12"
              >
                <div className="h-48 rounded-3xl overflow-hidden relative shadow-2xl">
                  <Image src={WONDERS[2].image} alt={WONDERS[2].name} fill className="object-cover" />
                  <div className="absolute bottom-4 left-4 text-white font-bold text-sm">{WONDERS[2].name}</div>
                </div>
                <div className="h-64 rounded-3xl overflow-hidden relative shadow-2xl">
                  <Image src={WONDERS[3].image} alt={WONDERS[3].name} fill className="object-cover" />
                  <div className="absolute bottom-4 left-4 text-white font-bold text-sm">{WONDERS[3].name}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Wonders Showcase */}
<section className="py-24 bg-slate-50">

  {/* Title */}
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center space-y-4 mb-16">
      <h2 className="text-4xl font-bold tracking-tight">
        Discover the 7 Wonders
      </h2>
      <p className="text-slate-500 max-w-2xl mx-auto">
        Iconic destinations that define human achievement. Start your journey to one of these legendary sites today.
      </p>
    </div>
  </div>

  {/* Scroll */}
  <div className="mx-[1cm]">
    <div
      className="flex gap-6 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="flex gap-6 min-w-max">

        {SHOWCASE_WONDERS.map((wonder, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -10 }}
            className="flex-shrink-0 w-[320px] md:w-[340px] group cursor-grab active:cursor-grabbing snap-start"
          >
            <div className="h-[380px] md:h-[400px] rounded-[2.5rem] overflow-hidden relative shadow-xl">
              <Image
                src={wonder.image}
                alt={wonder.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 text-white space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                  {wonder.location}
                </p>
                <h4 className="text-2xl font-bold">{wonder.name}</h4>
              </div>
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  </div>

</section>

      {/* Planner Tool Placeholder */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold">Ready to Plan Your Trip?</h2>
          <p className="text-slate-500">
            Let AI craft your personalized itinerary in seconds.
          </p>
          <Link
            href="/planner"
            className="inline-block px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition"
          >
            Go to Trip Planner →
          </Link>
        </div>
      </section>


      <Footer />
    </main>
  );
}
