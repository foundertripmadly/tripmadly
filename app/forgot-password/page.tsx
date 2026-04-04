'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage('Reset link sent! Check your email.');
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-6">
      <div className="w-full max-w-sm bg-[#F5F3FF] border border-purple-100 rounded-3xl p-8 space-y-6 shadow-xl">

        <div className="text-center space-y-3">
          <Logo />
          <h1 className="text-xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-600 text-sm">Enter your email to reset</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 py-3 bg-white border border-purple-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {message && <p className="text-green-600 text-xs">{message}</p>}

          <button
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
            <ArrowRight size={16} />
          </button>

        </form>

        <p className="text-center text-xs text-gray-600">
          <Link href="/login" className="text-purple-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>

      </div>
    </main>
  );
}