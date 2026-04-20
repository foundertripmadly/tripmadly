import { NextResponse } from "next/server"
import { razorpay } from "@/lib/razorpay"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    // ===============================
    // 🔐 AUTH CHECK
    // ===============================
    const authHeader = req.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 })
    }

    // ===============================
    // 📦 BODY
    // ===============================
    const body = await req.json()
    const { plan } = body

    // ===============================
    // ✅ PLAN VALIDATION (ANTI-HACK)
    // ===============================
    if (!["monthly", "yearly"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      )
    }

    // ===============================
    // 🔒 DUPLICATE SUB CHECK (CRITICAL)
    // ===============================
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["active", "created", "authenticated", "pending"])
      .neq("plan_type", "free")
      .maybeSingle()

    if (existingSub) {
      return NextResponse.json(
        { error: "You already have an active subscription" },
        { status: 400 }
      )
    }

    // ===============================
    // 💳 PLAN CONFIG
    // ===============================
    let plan_id = ""
    let total_count = 1

    if (plan === "monthly") {
      plan_id = process.env.RAZORPAY_MONTHLY_PLAN_ID!
      total_count = 12
    }

    if (plan === "yearly") {
      plan_id = process.env.RAZORPAY_YEARLY_PLAN_ID!
      total_count = 1
    }

    if (!plan_id) {
      return NextResponse.json(
        { error: "Plan configuration error" },
        { status: 500 }
      )
    }

    // ===============================
    // 🚀 CREATE SUBSCRIPTION
    // ===============================
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan_id,
      customer_notify: 1,
      total_count: total_count,

      // 🔐 SECURE METADATA (VERY IMPORTANT)
      notes: {
        user_id: user.id,
        plan_type: plan,
        source: "tripmadly_web",
      },
    })

    // ===============================
    // ✅ RESPONSE
    // ===============================
    return NextResponse.json({
      subscription_id: subscription.id,
    })
  } catch (error) {
    console.error("Razorpay subscription creation error:", error)

    return NextResponse.json(
      { error: "Subscription creation failed" },
      { status: 500 }
    )
  }
}