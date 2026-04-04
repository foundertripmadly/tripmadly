'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { MapPin, ChevronRight } from 'lucide-react';
import { fetchAPI, getStrapiURL } from '@/lib/api';

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  // ✅ FETCH DATA
  useEffect(() => {
    const load = async () => {
      const res = await fetchAPI('/api/holidays?populate=*');

      const data = (res.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        location: item.location,
        price: item.price,
        duration: item.duration,
        tag: item.tag || '',
        affiliate_link: item.affiliate_link,
        image:
          item.image?.formats?.medium?.url ||
          item.image?.url ||
          null,
      }));

      setHolidays(data);
      setFiltered(data);
    };

    load();
  }, []);

  // ✅ LIVE SEARCH
  useEffect(() => {
    if (!search) {
      setFiltered(holidays);
      return;
    }

    const query = search.toLowerCase();

    const result = holidays.filter((pkg) => {
      const title = pkg.title?.toLowerCase() || "";
      const location = pkg.location?.toLowerCase() || "";

      return (
        title.includes(query) ||
        location.includes(query) ||
        title.startsWith(query) ||
        location.startsWith(query)
      );
    });

    setFiltered(result);
  }, [search, holidays]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ✅ UPDATED HEADER (SEARCH SHIFTED RIGHT) */}
          <div className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* LEFT */}
            <div>
              <h1 className="text-5xl font-bold text-slate-900">
                Holiday Packages
              </h1>

              <p className="text-slate-600 mt-2">
                Handpicked experiences for your next unforgettable journey.
              </p>
            </div>

            {/* RIGHT SEARCH */}
            <input
              type="text"
              placeholder="Search packages"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full lg:w-[420px] px-6 py-4 rounded-full border-2 border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.length === 0 ? (
              <div className="col-span-3 text-center text-slate-500 text-lg">
                No matching packages found.
              </div>
            ) : (
              filtered.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl group"
                >
                  {/* IMAGE */}
                  <div className="h-64 relative">
                    <Image
                      src={getStrapiURL(pkg.image || "/fallback.jpg")}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* TAG */}
                    {pkg.tag && (
                      <div className="absolute top-6 right-6 bg-white px-3 py-1 rounded-full text-xs font-bold text-black">
                        {pkg.tag}
                      </div>
                    )}

                    {/* DURATION */}
                    <div className="absolute top-6 left-6 bg-white px-3 py-1 rounded-full text-xs font-bold text-black">
                      {pkg.duration}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <div className="text-indigo-600 text-xs font-bold flex items-center gap-1">
                      <MapPin size={14} /> {pkg.location}
                    </div>

                    <h3 className="text-xl font-bold mt-2">
                      {pkg.title}
                    </h3>

                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="text-xs text-slate-400">
                          Starting from
                        </p>
                        <p className="text-xl font-bold">
                          {pkg.price}
                        </p>
                      </div>

                      <a
                        href={
                          pkg.affiliate_link?.startsWith('http')
                            ? pkg.affiliate_link
                            : `https://${pkg.affiliate_link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-indigo-600 transition"
                      >
                        Book Now <ChevronRight size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}