'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  User,
  LogOut,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // ✅ Get session safely
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Holidays', href: '/holidays' },
    { name: 'Hotels', href: '/hotels' },
    { name: 'Travel Blog', href: '/blogs' },
    { name: 'About Us', href: '/about' },
  ];

  // ✅ FIXED AVATAR LOGIC
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

    

  const userInitial = user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-indigo-600 transition ${
                pathname === link.href ? 'text-indigo-600' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center min-w-[200px] justify-end relative">
          {loading ? (
            <div className="h-10 w-10 bg-slate-100 rounded-full animate-pulse" />
          ) : user ? (
            <div ref={dropdownRef} className="relative">

              {/* Avatar */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {userInitial}
                  </div>
                )}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-3">

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    <User size={16} />
                    Dashboard
                  </Link>

                  <Link
                    href="/subscribe"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    <CreditCard size={16} />
                    Subscription
                  </Link>

                  <hr className="my-2 border-slate-100" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>

                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-bold px-6 py-2 rounded-full border border-slate-200 hover:bg-slate-50"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="text-sm font-bold text-white bg-indigo-600 px-6 py-2 rounded-full hover:bg-indigo-700 flex items-center gap-2"
              >
                <Sparkles size={14} />
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100">
          <div className="px-6 py-6 space-y-6">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-base font-medium text-slate-700"
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-slate-100" />

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium"
                >
                  Dashboard
                </Link>

                <Link
                  href="/subscribe"
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium"
                >
                  Subscription
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block text-base font-medium text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/login"
                  className="text-center py-3 rounded-xl border border-slate-200 font-bold"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="text-center py-3 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Signup
                </Link>
              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}