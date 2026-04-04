'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // ✅ CLIENT SIDE PROTECTION
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        router.replace('/dashboard')
      }
    }
    checkUser()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.replace('/dashboard')
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-6">
      <div className="w-full max-w-sm bg-[#F5F3FF] border border-purple-100 rounded-3xl p-8 space-y-6 shadow-xl">

        <div className="text-center space-y-3">
          <Logo />
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to continue</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 border border-purple-200 rounded-xl text-gray-800 hover:bg-purple-50 transition font-medium"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3 text-gray-400 text-xs">
          <div className="flex-1 h-px bg-purple-200" />
          OR
          <div className="flex-1 h-px bg-purple-200" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs text-gray-600">Email</label>
            <div className="relative mt-1">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 py-3 bg-white border border-purple-200 rounded-xl text-gray-900 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600">Password</label>
            <div className="relative mt-1">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-3 bg-white border border-purple-200 rounded-xl text-gray-900 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="text-right text-xs">
            <Link href="/forgot-password" className="text-purple-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-xs text-gray-600">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-purple-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </main>
  )
}