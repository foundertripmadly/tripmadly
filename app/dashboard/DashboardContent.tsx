'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, CreditCard, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardPage() {

  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useSearchParams();

  async function loadDashboard() {

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    const userId = session.user.id;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    setProfile(profileData);
    setSubscription(subscriptionData);
    setLoading(false);
  }

  useEffect(() => {

    loadDashboard();

    /* Refresh dashboard if subscription success */
    if (params.get("subscription") === "success") {

      setTimeout(() => {
        loadDashboard();
      }, 2000);

    }

  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        Loading...
      </div>
    );
  }

  /* Determine real status */

  let status = "inactive";

  if (subscription?.status === "active") {

    const now = new Date();
    const end = subscription?.current_period_end
      ? new Date(subscription.current_period_end)
      : null;

    if (!end || end > now) {
      status = "active";
    } else {
      status = "expired";
    }

  }

  return (
    <main className="min-h-screen bg-slate-50">

      <Navbar />

      <section className="pt-32 pb-20 px-6">

        <div className="max-w-7xl mx-auto space-y-12">

          {/* Header */}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

            <div>

              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Welcome back, {profile?.full_name || 'Traveler'}
              </h1>

              <p className="text-black mt-1 font-medium">
                Manage your trips and subscription.
              </p>

            </div>

            <button
              onClick={() => router.push('/planner')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition-all"
            >
              <Sparkles size={18}/> Plan New Trip
            </button>

          </div>

          {/* Content */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Subscription */}

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border">

              <div className="flex items-center justify-between mb-6">

                <h3 className="font-bold text-slate-900">
                  Subscription
                </h3>

                <CreditCard size={20} className="text-indigo-600"/>

              </div>

              <div className="flex justify-between mb-3">

                <span className="text-sm text-black mt-1 font-medium">
                  Plan
                </span>

                <span className="font-bold text-slate-900">
                  {subscription?.plan_type?.toUpperCase() || "FREE"}
                </span>

              </div>

              <div className="flex justify-between mb-3">

                <span className="text-sm text-black mt-1 font-medium">
                  Status
                </span>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    status === "active"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {status}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-sm text-black mt-1 font-medium">
                  Trips Used
                </span>

                <span className="font-bold text-slate-900">
                  {subscription?.trips_used || 0} / {subscription?.trips_limit || 0}
                </span>

              </div>

            </div>

            {/* Trips placeholder */}

            <div className="lg:col-span-2 bg-white p-12 rounded-[2.5rem] border border-black text-center flex flex-col items-center justify-center shadow-sm">

              <MapPin size={32} className="text-slate-400 mb-4"/>

              <p className="font-semibold text-lg text-slate-900">
                No trips planned yet?
              </p>

              <p className="text-sm text-black mt-1 font-medium">
                Generate your first AI trip in seconds.
              </p>

              <p className="text-sm text-indigo-600 font-semibold mt-2">
                *Download your trip PDF after generation.
              </p>

              <button
                onClick={() => router.push('/planner')}
                className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
              >
                Plan a trip now
              </button>

            </div>

          </div>

        </div>

      </section>

      <Footer/>

    </main>
  );
}