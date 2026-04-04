'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'motion/react'
import { Sparkles, Check, Shield, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function SubscribePage() {

  const [user, setUser] = useState<any>(null)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {

    const checkUser = async () => {

      const { data:{session} } = await supabase.auth.getSession()

      if(!session){
        router.push('/login')
        return
      }

      setUser(session.user)

    }

    checkUser()

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

  },[router])



  const handleSubscribe = async (plan:'monthly' | 'yearly') => {

    try{

      setLoadingPlan(plan)

      const { data:{session} } = await supabase.auth.getSession()

      const token = session?.access_token

      const res = await fetch('/api/razorpay/create-subscription',{

        method:'POST',

        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        },

        body:JSON.stringify({
          plan
        })

      })

      const data = await res.json()

      if(!data.subscription_id){
        throw new Error('Failed to create subscription')
      }


      const options = {

        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        subscription_id: data.subscription_id,

        name: 'TripMadly',

        description: plan === 'monthly'
        ? 'Monthly Explorer Plan'
        : 'Yearly Nomad Plan',

        handler: function () {

          setTimeout(() => {
            router.push('/dashboard?subscription=success')
          }, 1500)

        },

        prefill: {
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
        },

        theme:{
          color:'#4f46e5'
        }

      }

      const rzp = new window.Razorpay(options)

      rzp.open()

    }

    catch(err){

      console.error(err)

      alert('Subscription failed. Please try again.')

    }

    finally{

      setLoadingPlan(null)

    }

  }



  const plans = [

    {
      id:'monthly',
      name:'Monthly Explorer',
      price:'₹99',
      period:'/month',
      desc:'Perfect for a single trip.',
      features:[
        '5 Trip Credits',
        'PDF Downloads',
        'Best Holiday Deals (Free)',
        'Best Hotel Deals (Free)'
      ],
      buttonText:'Start Now',
      highlight:false
    },

    {
      id:'yearly',
      name:'Yearly Nomad',
      price:'₹999',
      period:'/year',
      desc:'For the frequent traveler.',
      features:[
        '60 Trip Credits',
        'PDF Downloads',
        'Best Holiday Deals (Free)',
        'Best Hotel Deals (Free)'
      ],
      buttonText:'Subscribe Now',
      highlight:true
    }

  ]



  return (

    <main className="min-h-screen bg-slate-50">

      <Navbar/>

      <section className="pt-40 pb-24 px-6">

        <div className="max-w-7xl mx-auto space-y-16">

          <div className="text-center space-y-4 max-w-2xl mx-auto">

            <h1 className="text-5xl font-bold tracking-tight text-slate-900">
              Choose Your Plan
            </h1>

            <p className="text-slate-600 text-lg">
              Unlock the full power of AI-driven travel planning.
            </p>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {plans.map((plan)=>(

              <motion.div
              key={plan.id}
              whileHover={{y:-10}}
              className={`p-12 rounded-[3.5rem] space-y-10 relative overflow-hidden ${
                plan.highlight
                ?'bg-indigo-600 text-white shadow-2xl shadow-indigo-200'
                :'bg-white text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-100'
              }`}
              >

                {plan.highlight && (

                  <div className="absolute top-8 right-8 bg-white/20 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Best Value
                  </div>

                )}



                <div className="space-y-2">

                  <h3 className="text-2xl font-bold">
                    {plan.name}
                  </h3>

                  <p className={plan.highlight ? 'text-white/70' : 'text-slate-500'}>
                    {plan.desc}
                  </p>

                </div>



                <div className="flex items-baseline gap-1">

                  <span className="text-6xl font-bold">
                    {plan.price}
                  </span>

                  <span className={plan.highlight ? 'text-white/70' : 'text-slate-500'}>
                    {plan.period}
                  </span>

                </div>



                <ul className="space-y-4">

                  {plan.features.map((f,i)=>(
                    <li key={i} className="flex items-center gap-3 text-sm">

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlight ? 'bg-white/20' : 'bg-indigo-50'
                      }`}>

                        <Check size={12} className={plan.highlight ? 'text-white' : 'text-indigo-600'} />

                      </div>

                      {f}

                    </li>
                  ))}

                </ul>



                <button
                disabled={loadingPlan === plan.id}
                onClick={()=>handleSubscribe(plan.id as 'monthly' | 'yearly')}
                className={`w-full py-5 rounded-2xl font-bold transition-all ${
                  plan.highlight
                  ?'bg-white text-indigo-600 hover:bg-indigo-50'
                  :'bg-slate-900 text-white hover:bg-slate-800'
                }`}
                >

                  {loadingPlan === plan.id ? 'Processing...' : plan.buttonText}

                </button>

              </motion.div>

            ))}

          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-12">

            <div className="flex items-center gap-4 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">

              <Shield className="text-indigo-600"/>

              <div className="text-sm">
                <p className="font-bold">Secure Payments</p>
                <p className="text-slate-500">Encrypted by Razorpay</p>
              </div>

            </div>



            <div className="flex items-center gap-4 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">

              <Zap className="text-amber-600"/>

              <div className="text-sm">
                <p className="font-bold">Instant Access</p>
                <p className="text-slate-500">Unlock features immediately</p>
              </div>

            </div>



            <div className="flex items-center gap-4 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">

              <Sparkles className="text-indigo-600"/>

              <div className="text-sm">
                <p className="font-bold">AI-Powered</p>
                <p className="text-slate-500">Using cutting-edge technology</p>
              </div>

            </div>

          </div>

        </div>

      </section>

      <Footer/>

    </main>

  )

}