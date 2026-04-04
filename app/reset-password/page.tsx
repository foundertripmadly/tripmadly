'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ✅ IMPORTANT: Initialize session from URL hash
  useEffect(() => {
    const handleSession = async () => {
      await supabase.auth.getSession();
    };

    handleSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('Password updated successfully!');

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-6">
      <div className="w-full max-w-sm bg-[#F5F3FF] border border-purple-100 rounded-3xl p-8 space-y-6 shadow-xl">

        <div className="text-center space-y-3">
          <Logo />
          <h1 className="text-xl font-bold text-gray-900">Reset Password</h1>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-9 py-3 bg-white border border-purple-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {message && <p className="text-green-600 text-xs">{message}</p>}

          <button
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition"
          >
            Update Password
            <ArrowRight size={16} />
          </button>

        </form>

      </div>
    </main>
  );
}