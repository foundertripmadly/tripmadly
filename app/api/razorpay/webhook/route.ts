export const runtime = "nodejs"

import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  console.log("🚀 WEBHOOK HIT")

  try {
    // ===============================
    // 📦 RAW BODY (REQUIRED FOR SIGNATURE)
    // ===============================
    const rawBody = await req.text()

    const signature = req.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // ===============================
    // 🔐 VERIFY SIGNATURE (CRITICAL)
    // ===============================
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex")

    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)

    if (sigBuffer.length !== expectedBuffer.length) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const isValid = crypto.timingSafeEqual(sigBuffer, expectedBuffer)

    if (!isValid) {
      console.error("❌ Razorpay webhook signature mismatch")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // ===============================
    // 📩 PARSE EVENT
    // ===============================
    const event = JSON.parse(rawBody)

    console.log("📩 Razorpay webhook:", event.event)
    console.log("🧪 RAW EVENT:", JSON.stringify(event, null, 2))

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ===============================
    // 🔒 IDEMPOTENCY
    // ===============================
    const eventId = event.id

    if (!eventId) {
      return NextResponse.json({ received: true })
    }

    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id")
      .eq("id", eventId)
      .maybeSingle()

    if (existingEvent) {
      console.log("⚠️ Duplicate webhook ignored:", eventId)
      return NextResponse.json({ received: true })
    }

    const { error: webhookInsertError } = await supabase
      .from("webhook_events")
      .insert({ id: eventId })

    if (webhookInsertError) {
      console.error("❌ Webhook insert failed:", webhookInsertError)
      return NextResponse.json({ error: "Webhook insert failed" }, { status: 500 })
    }

    // ===============================
    // 📦 EXTRACT SUBSCRIPTION
    // ===============================
    console.log("🔥 FULL EVENT:", JSON.stringify(event, null, 2))

    let subscription = event.payload?.subscription?.entity

    // 🔥 ROBUST FALLBACK (handles payment events)
    if (!subscription) {
      const payment = event.payload?.payment?.entity

      if (payment?.subscription_id) {
        console.log("⚠️ Using payment fallback")

        subscription = {
          id: payment.subscription_id,

          notes: {
            user_id:
              payment.notes?.user_id ||
              event.payload?.subscription?.entity?.notes?.user_id,

            plan_type:
              payment.notes?.plan_type ||
              event.payload?.subscription?.entity?.notes?.plan_type ||
              "monthly",
          },

          current_start:
            payment?.created_at || Math.floor(Date.now() / 1000),

          current_end:
            (payment?.notes?.plan_type === "yearly")
            ? Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
            : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        }
      }
    }

    // ===============================
    // 🧠 DEBUG LOGS
    // ===============================
    console.log("🧠 SUBSCRIPTION:", subscription)
    console.log("🧠 FINAL NOTES:", subscription?.notes)
    console.log("🧠 FINAL USER ID:", subscription?.notes?.user_id)

    if (!subscription) {
      console.log("⚠️ No subscription payload")
      return NextResponse.json({ received: true })
    }

    let userId = subscription.notes?.user_id

// 🔥 HARD FALLBACK (CRITICAL)
   if (!userId) {
     userId =
       event.payload?.payment?.entity?.notes?.user_id ||
       event.payload?.subscription?.entity?.notes?.user_id
   }

   if (!userId) {
     console.log("❌ FINAL FAIL: user_id not found anywhere")
     return NextResponse.json({ received: true })
  }
    const planType = subscription.notes?.plan_type || "monthly"
    console.log("📦 Plan Type from Razorpay:", planType)

    const razorpaySubId = subscription.id

    const currentStart = new Date(subscription.current_start * 1000)
    const currentEnd = new Date(subscription.current_end * 1000)

    // ===============================
    // 🎯 PLAN LIMIT LOGIC
    // ===============================
    let limit = 5
    if (planType === "yearly") limit = 60

    // ===============================
    // ❌ IGNORE CANCEL (CRITICAL FIX)
    // ===============================
    if (event.event === "subscription.cancelled") {
      console.log("⚠️ Ignoring cancel event (temporary protection)")
      return NextResponse.json({ received: true })
    }

    // ===============================
    // 🚀 ACTIVATE (FINAL FIX)
    // ===============================
    const allowedEvents = [
      "subscription.activated",
      "subscription.charged"
    ]

    if (allowedEvents.includes(event.event)) {
      console.log("🚀 Activating:", userId)
      console.log("🔥 UPDATING USER:", userId) 
      console.log("📦 Plan Type:", planType)
      
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("trips_used")
        .eq("user_id", userId)
        .maybeSingle()

      const tripsUsed = 0
      const { data, error } = await supabase
        .from("subscriptions")
        .upsert(
    {
      user_id: userId,
      plan_type: planType,
      razorpay_subscription_id: razorpaySubId,
      trips_limit: limit,
      trips_used: tripsUsed,
      status: "active",
      current_period_start: currentStart,
      current_period_end: currentEnd,
    },
    {
      onConflict: "user_id",
    }
  )

      if (error) {
        console.error("❌ Activation error:", error)
      } else {
        console.log("✅ DB SUCCESS:", data)
      }
    }
    
    console.log("✅ WEBHOOK PROCESSED SUCCESSFULLY")
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
