'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import Image from 'next/image';
import { MapPin, Star, ChevronRight } from 'lucide-react';
import { fetchAPI, getStrapiURL } from '@/lib/api';

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAPI('/api/hotels?populate=*');

        const data = (res.data || []).map((item: any) => {
          const attrs = item.attributes || item;

          return {
            id: item.id,
            title: attrs.name || "No title",
            location: attrs.location || "Unknown",
            price: attrs.price || "N/A",
            rating: attrs.rating || 0,
            tag: attrs.tag || "",
            affiliate_link: attrs.affiliate_link || "#",
            image:
              attrs.image?.formats?.medium?.url ||
              attrs.image?.formats?.small?.url ||
              attrs.image?.url ||
              null,
          };
        });

        setHotels(data);
        setFiltered(data);
      } catch (error) {
        console.error("Hotel fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ✅ LIVE SEARCH
  useEffect(() => {
    if (!search) {
      setFiltered(hotels);
      return;
    }

    const query = search.toLowerCase();

    const result = hotels.filter((hotel) => {
      const title = hotel.title?.toLowerCase() || "";
      const location = hotel.location?.toLowerCase() || "";

      return (
        title.includes(query) ||
        location.includes(query) ||
        title.startsWith(query) ||
        location.startsWith(query)
      );
    });

    setFiltered(result);
  }, [search, hotels]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ✅ HEADER (SEARCH RIGHT SIDE) */}
          <div className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <h1 className="text-5xl font-bold text-slate-900">
                Hotels
              </h1>

              <p className="text-slate-600 mt-2 text-lg">
                Find the best stays for your perfect trip.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search hotels"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full lg:w-[420px] px-6 py-4 rounded-full border-2 border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-[2.5rem]" />
              ))
            ) : filtered.length === 0 ? (
              <div className="col-span-3 text-center text-slate-500 text-lg">
                No hotels found.
              </div>
            ) : (
              filtered.map((hotel) => (
                <motion.div
                  key={hotel.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl group flex flex-col"
                >
                  {/* IMAGE */}
                  <div className="h-64 relative">
                    <Image
                      src={getStrapiURL(hotel.image || "/fallback.jpg")}
                      alt={hotel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* 🏷 TAG */}
                    {hotel.tag && (
                      <div className="absolute top-6 right-6 bg-white px-3 py-1 rounded-full text-xs font-bold text-black">
                        {hotel.tag}
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div className="space-y-3">
                      <div className="text-indigo-600 text-xs font-bold flex items-center gap-1">
                        <MapPin size={14} /> {hotel.location}
                      </div>

                      <h3 className="text-xl font-bold">
                        {hotel.title}
                      </h3>

                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={16} /> {hotel.rating}
                      </div>
                    </div>

                    {/* PRICE + CTA */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div>
                        <p className="text-xs text-slate-400">
                          Price
                        </p>
                        <p className="text-xl font-bold">
                          {hotel.price}
                        </p>
                      </div>

                      <a
                        href={
                          hotel.affiliate_link?.startsWith("http")
                            ? hotel.affiliate_link
                            : `https://${hotel.affiliate_link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-indigo-600 transition"
                      >
                        Book Now <ChevronRight size={16} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}