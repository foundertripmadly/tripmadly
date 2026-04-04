'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-20 px-6 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Logo + Description */}
        <div className="space-y-6">
          <Logo />
          <p className="text-sm text-slate-500 leading-relaxed">
            Making world travel accessible, smart, and unforgettable through the power of AI.
          </p>
        </div>

        {/* Company */}
        <div className="space-y-6">
          <h5 className="font-bold text-sm uppercase tracking-widest">Company</h5>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link></li>
            <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Explore */}
        <div className="space-y-6">
          <h5 className="font-bold text-sm uppercase tracking-widest">Explore</h5>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link href="/holidays" className="hover:text-indigo-600 transition-colors">Holidays</Link></li>
            <li><Link href="/hotels" className="hover:text-indigo-600 transition-colors">Hotels</Link></li>
            <li><Link href="/blogs" className="hover:text-indigo-600 transition-colors">Travel Blog</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h5 className="font-bold text-sm uppercase tracking-widest">Newsletter</h5>
          <p className="text-sm text-slate-500">Get travel tips and deals in your inbox.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-900">
        <p>© {year ?? ''} TripMadly. All rights reserved.</p>

        {/* Social Icons */}
        <div className="flex gap-6">
          <a href="https://instagram.com/tripmadly" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-900 transition-colors">
            <Instagram size={16} />
          </a>

          <a href="https://x.com/TripMadly" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-900 transition-colors font-bold text-sm">
            X
          </a>

          <a href="https://www.linkedin.com/company/tripmadly/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-900 transition-colors">
            <Linkedin size={16} />
          </a>

          <a href="https://youtube.com/@TripMadly" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-900 transition-colors">
            <Youtube size={16} />
          </a>

          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=supporttripmadly@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-900 transition-colors">
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}