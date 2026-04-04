import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Calendar, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { fetchAPI, getStrapiURL } from '@/lib/api';

export const revalidate = 60;

async function getBlogs() {
  const res = await fetchAPI('/api/blogs?populate=*');

  return (res.data || []).map((item: any) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    date: item.date,
    author: item.author,
    image:
      item.image?.formats?.medium?.url ||
      item.image?.url ||
      null,
  }));
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">
              Travel Stories
            </h1>
            <p className="text-slate-600 text-lg">
              Inspiration, tips, and guides from global explorers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {blogs.map((blog: any) => (
              <div
                key={blog.id}
                className="bg-white rounded-[3rem] overflow-hidden shadow-xl group flex flex-col"
              >
                {/* IMAGE */}
                <div className="h-72 relative">
                  <Image
                    src={blog.image ? getStrapiURL(blog.image) : "/fallback.jpg"}
                    alt={blog.title || "Blog Image"}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-10 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex gap-4 text-xs text-slate-400 uppercase mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {blog.date
                          ? new Date(blog.date).toDateString()
                          : "No date"}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {blog.author || "Admin"}
                      </span>
                    </div>

                    {/* ✅ FIX 1: SAFE TITLE */}
                    <h3 className="text-2xl font-bold mb-3">
                      {blog.title || "Untitled"}
                    </h3>

                    {/* ✅ FIX 2: SAFE EXCERPT */}
                    <p className="text-slate-500 line-clamp-3">
                      {blog.excerpt || "No description available"}
                    </p>
                  </div>

                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-bold"
                  >
                    Read More <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}