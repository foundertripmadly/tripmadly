'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { MapPin, ChevronRight } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL!;

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  // ✅ FETCH DATA (STANDARDIZED)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAPI('/holidays?populate=*');

        const data = (res?.data || []).map((item: any) => {
          const attr = item.attributes || item;

          const imagePath =
            attr.image?.url ||
            attr.image?.formats?.medium?.url ||
            null;

          return {
            id: item.id,
            title: attr.title || "",
            location: attr.location || "",
            price: attr.price || "",
            duration: attr.duration || "",
            tag: attr.tag || "",
            affiliate_link: attr.affiliate_link || "",

            image: imagePath
              ? `${IMAGE_BASE_URL}${imagePath}`
              : null,
          };
        });

        console.log("HOLIDAYS DATA:", data);

        setHolidays(data);
        setFiltered(data);
      } catch (error) {
        console.error("Holiday fetch error:", error);
      }
    };

    load();
  }, []);

  // ✅ SEARCH
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
        location.includes(query)
      );
    });

    setFiltered(result);
  }, [search, holidays]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold text-slate-900">
                Holiday Packages
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Handpicked experiences for your next unforgettable journey.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search packages"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full lg:w-[420px] px-6 py-4 rounded-full border-2 border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl"
                >
                  {/* IMAGE */}
                  <div className="h-64 relative overflow-hidden rounded-t-[2.5rem]">
                    <Image
                      src={pkg.image || "/fallback.jpg"}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />

                    {/* ✅ TAG ADDED (ONLY CHANGE) */}
                    {pkg.tag && (
                      <div className="absolute top-6 right-6 bg-white px-3 py-1 rounded-full text-xs font-bold text-black">
                        {pkg.tag}
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <div className="text-indigo-600 text-xs font-bold flex items-center gap-1">
                      <MapPin size={14} /> {pkg.location}
                    </div>

                    <h3 className="text-xl font-bold mt-2">
                      {pkg.title}
                    </h3>

                    <p className="mt-2 font-bold">{pkg.price}</p>

                    <a
                      href={
                        pkg.affiliate_link?.startsWith("http")
                          ? pkg.affiliate_link
                          : `https://${pkg.affiliate_link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition"
                    >
                      Book Now <ChevronRight size={16} className="inline ml-1" />
                    </a>
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