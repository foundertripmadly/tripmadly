"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function AuthCard({ type }: { type: "login" | "signup" }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/assets/logo.png"
            alt="TripMadly Logo"
            width={140}
            height={40}
            priority
          />
          <p className="text-gray-500 mt-3 text-sm">
            {type === "login" ? "Welcome back to TripMadly" : "Create your TripMadly account"}
          </p>
        </div>

        {/* Google Button */}
        <button className="w-full bg-white border border-gray-300 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-50 transition mb-6">
          Continue with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <form className="space-y-5">

          {type === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-gray-900 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-gray-900 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-gray-900 pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-md">
            {type === "login" ? "Sign In" : "Get Started"}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          {type === "login" ? (
            <>
              Don’t have an account?{" "}
              <Link href="/signup" className="text-purple-600 hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>

      </div>
    </div>
  );
}