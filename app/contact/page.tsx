'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Instagram, Linkedin, Youtube, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <h1 className="text-5xl font-bold">Contact Us</h1>

          <p className="text-slate-600 text-lg">
            Have questions, feedback, or need support? We're here to help you plan better trips.
          </p>

          {/* Email */}
          <div className="bg-slate-50 p-6 rounded-2xl">
            <p className="text-slate-500">Support Email</p>
            <p className="text-xl font-bold text-slate-900">
              supporttripmadly@gmail.com
            </p>
          </div>

          {/* Socials */}
          <div className="flex justify-center gap-6 pt-6">
            <a href="https://instagram.com/tripmadly" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
              <Instagram />
            </a>

            <a href="https://x.com/TripMadly" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 font-bold text-lg">
              X
            </a>

            <a href="https://www.linkedin.com/company/tripmadly/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
              <Linkedin />
            </a>

            <a href="https://youtube.com/@TripMadly" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
              <Youtube />
            </a>

            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=supporttripmadly@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-900 transition-colors">
              <Mail />
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}