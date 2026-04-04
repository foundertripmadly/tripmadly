import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrencyFromCountry } from "@/lib/currency"

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"
const GEMINI_BASE = process.env.GEMINI_API_BASE
const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY

const FALLBACK_IMAGE =
"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"

function photoUrl(photoRef?: string, max = 1200) {
if (!photoRef) return FALLBACK_IMAGE
return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${max}&photoreference=${photoRef}&key=${GOOGLE_KEY}`
}

function scorePlace(p:any){
const rating = p.rating || 0
const reviews = p.user_ratings_total || 0
return rating * Math.log10(reviews + 1)
}

export async function POST(req:Request){

try{

const origin = req.headers.get("origin")

const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL || "https://tripmadly.com",
  "https://www.tripmadly.com",
  "http://localhost:3000" // ✅ dev
]

if (
  !origin ||
  !allowedOrigins.some((o) => origin.startsWith(o))
) {
  return NextResponse.json(
    { error: "Invalid request origin" },
    { status: 403 }
  )
}

const authHeader = req.headers.get("authorization")
if(!authHeader){
return NextResponse.json({error:"Unauthorized"},{status:401})
}

const token = authHeader.replace("Bearer ","")

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

const {data:{user}} = await supabase.auth.getUser()

if(!user){
return NextResponse.json({error:"Invalid user"},{status:401})
}

const userId = user.id

/* ---------- RATE LIMIT CHECK ---------- */

const { data: allowed } = await supabase.rpc("check_rate_limit", {
  user_id_input: userId
})


if (!allowed) {
  return NextResponse.json(
    { error: "Too many requests. Please wait a moment." },
    { status: 429 }
  )
}

/* ---------- AI REQUEST LOCK ---------- */

const { data: lock } = await supabase.rpc("acquire_ai_lock", {
  user_id_input: userId
})

// ✅ SAFE CHECK
if (lock !== true) {
  return NextResponse.json(
    { error: "Please wait before generating another trip." },
    { status: 429 }
  )
}

/* ---------- CHECK SUBSCRIPTION + CREDITS ---------- */


const { data: sub } = await supabase
  .from("subscriptions")
  .select("*")
  .eq("user_id", userId)
  .single()

// ❌ No subscription found
if (!sub) {
  await supabase.rpc("release_ai_lock", {
    user_id_input: userId
  })

  return NextResponse.json(
    { error: "No subscription found" },
    { status: 403 }
  )
}

const now = new Date()

// ❌ Subscription inactive or expired
if (
  sub.status !== "active" ||
  (sub.current_period_end && new Date(sub.current_period_end) < now)
) {
  await supabase.rpc("release_ai_lock", {
    user_id_input: userId
  })

  return NextResponse.json(
    { error: "Subscription expired" },
    { status: 403 }
  )
}

// ❌ Credits finished
if (sub.trips_used >= sub.trips_limit) {
  await supabase.rpc("release_ai_lock", {
    user_id_input: userId
  })

  return NextResponse.json(
    { error: "No credits left" },
    { status: 403 }
  )
}


const {destination,days,budget} = await req.json()

/* ---------- Country + Currency ---------- */

const ip =
  req.headers.get("x-forwarded-for")?.split(",")[0] || "8.8.8.8"

let country = "US"

try {
  const geoRes = await fetch(`https://ipapi.co/${ip}/json/`)
  const geoData = await geoRes.json() as { country?: string }

  country = geoData?.country || "US"
} catch {
  country = "US"
}
const currency = getCurrencyFromCountry(country)

/* ---------- Budget logic ---------- */

let hotelKeyword = "hotel"

if (budget === "Budget") {
  hotelKeyword = "hostel OR dormitory OR budget hotel"
}

if (budget === "Moderate") {
  hotelKeyword = "3 star hotel OR 4 star hotel"
}

if (budget === "Luxury") {
  hotelKeyword = "5 star hotel OR luxury hotel"
}

/* ---------- Geocode destination ---------- */

const geoRes2 = await fetch(
  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${GOOGLE_KEY}`
)

const geoData2 = await geoRes2.json()
const location = geoData2.results?.[0]?.geometry?.location

if (!location) {
  await supabase.rpc("release_ai_lock", {
    user_id_input: userId
  })

  return NextResponse.json(
    { error: "Destination not found" },
    { status: 400 }
  )
}

const lat = location.lat
const lng = location.lng

/* ---------- HERO IMAGE ---------- */

const heroSearch = await fetch(
`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(destination+" famous landmark")}&key=${GOOGLE_KEY}`
)

const heroData = await heroSearch.json()

let heroPlace =
heroData.results?.find((p:any)=>p.photos) ||
heroData.results?.[0]

const heroImage = heroPlace
? photoUrl(heroPlace.photos?.[0]?.photo_reference,1600)
: `https://maps.googleapis.com/maps/api/streetview?size=1600x800&location=${lat},${lng}&key=${GOOGLE_KEY}`

/* ---------- HOTELS ---------- */

const hotelRes = await fetch(
`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(destination + " " + hotelKeyword)}&key=${GOOGLE_KEY}`
)

const hotelData = await hotelRes.json()

let hotelCandidates = hotelData.results || []

hotelCandidates = hotelCandidates
.sort((a:any,b:any)=>scorePlace(b)-scorePlace(a))

let bestHotel = hotelCandidates[0] || hotelData.results?.[0] || {}

const hotel = {
  name: bestHotel?.name || "Recommended Hotel",
  location: bestHotel?.formatted_address || bestHotel?.vicinity || destination,
  rating: bestHotel?.rating || 4,
  image: photoUrl(bestHotel?.photos?.[0]?.photo_reference,900),
  lat: bestHotel?.geometry?.location?.lat || lat,
  lng: bestHotel?.geometry?.location?.lng || lng
}

/* ---------- ATTRACTIONS ---------- */

const placeRes = await fetch(
`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=12000&type=tourist_attraction&key=${GOOGLE_KEY}`
)

const placeData = await placeRes.json()

let placeCandidates = placeData.results || []

placeCandidates = placeCandidates
.sort((a:any,b:any)=>scorePlace(b)-scorePlace(a))

let bestPlace =
placeCandidates.find((p:any)=>p.photos) ||
placeCandidates[0]

const destinationPlace = {
name: bestPlace?.name || destination,
image: photoUrl(bestPlace?.photos?.[0]?.photo_reference,900)
}


/* ---------- Gemini itinerary ---------- */

const prompt = `
You are a premium AI travel planner.

Create a highly personalized ${days}-day travel plan for ${destination}.

User budget: ${budget}

VERY IMPORTANT RULES:

1. PERSONALIZATION BASED ON BUDGET:

- Budget:
  - Food → street food, local eateries
  - Transport → bus, metro, walking, trains
  - Stay → hostels, dorms, budget lodges

- Moderate:
  - Food → mix of local + good cafes/restaurants
  - Transport → cab + metro
  - Stay → 3-4 star hotels

- Luxury:
  - Food → premium restaurants, fine dining
  - Transport → private cab, premium travel
  - Stay → 5-star hotels

2. OUTPUT STYLE:
- Clean
- Concise
- Practical
- No fluff

3. EACH DAY MUST INCLUDE:
- title
- short vibe line
- morning, afternoon, evening

4. EACH TIME BLOCK MUST INCLUDE:
- place
- activity
- food suggestion
- transport suggestion
- 1 smart tip

---

RETURN STRICT JSON ONLY:

{
  "trip_title": "",
  "summary": "",
  "daily_plan": [
    {
      "day": 1,
      "title": "",
      "vibe": "",
      "morning": {
        "place": "",
        "activity": "",
        "food": "",
        "transport": "",
        "tip": ""
      },
      "afternoon": {
        "place": "",
        "activity": "",
        "food": "",
        "transport": "",
        "tip": ""
      },
      "evening": {
        "place": "",
        "activity": "",
        "food": "",
        "transport": "",
        "tip": ""
      }
    }
  ]
}
`

const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 10000) // 10 sec

let geminiResponse

try {
  geminiResponse = await fetch(
    `${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      }),
      signal: controller.signal
    }
  )
} catch (err) {
  console.error("Gemini timeout or network error:", err)

  await supabase.rpc("release_ai_lock", {
    user_id_input: userId
  })

  return NextResponse.json(
    { error: "AI request timed out" },
    { status: 500 }
  )
} finally {
  clearTimeout(timeout)
}

// ❌ HANDLE API FAILURE
if (!geminiResponse.ok) {
  console.error("Gemini API error:", await geminiResponse.text())

  await supabase.rpc("release_ai_lock", {
    user_id_input: userId
  })

  return NextResponse.json(
    { error: "AI service temporarily unavailable" },
    { status: 500 }
  )
}

const geminiData = await geminiResponse.json()

const text =
geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ""

const clean = text.replace(/```json|```/g,"").trim()

let parsed

try{
parsed = JSON.parse(clean)
}catch{
parsed=null
}

/* ---------- AI Fallback ---------- */

if(!parsed || !parsed.daily_plan || parsed.daily_plan.length === 0){

const fallbackDays = []

for(let i=1;i<=days;i++){
fallbackDays.push({
  day: i,
  title: "Explore the destination",
  vibe: "Discover highlights and local experiences",
  morning: {
    place: destination,
    activity: "Explore popular attractions",
    food: "Try local breakfast spots",
    transport: "Walk or local transport",
    tip: "Start early to avoid crowds"
  },
  afternoon: {
    place: destination,
    activity: "Sightseeing & lunch",
    food: "Local restaurant or cafe",
    transport: "Auto / cab",
    tip: "Stay hydrated"
  },
  evening: {
    place: destination,
    activity: "Relax & explore nightlife",
    food: "Dinner at local place",
    transport: "Cab or walk",
    tip: "Check local timings"
  }
})
}

parsed={
trip_title:`Trip to ${destination}`,
summary:`Enjoy a ${days}-day journey exploring ${destination}.`,
daily_plan:fallbackDays
}

}

/* ---------- Cost ---------- */

let baseCost = 300

if(budget === "Moderate") baseCost = 800
if(budget === "Luxury") baseCost = 2000

const totalCost = baseCost * days

/* ---------- Map Points ---------- */

const map_points = [
  {
    name: hotel.name,
    lat: hotel.lat,
    lng: hotel.lng,
    type: "hotel"
  },
  {
    name: destinationPlace.name,
    lat,
    lng,
    type: "place"
  }
]

/* ---------- Final trip object ---------- */

const trip = {
  ...parsed,
  currency,
  total_estimated_cost: totalCost,
  cover_image: heroImage,
  hotels: [hotel],
  destinations: [destinationPlace],
  map_points
}


/* ---------- SAFE CREDIT DEDUCTION ---------- */

const { data: creditOk, error: creditError } = await supabase.rpc(
  "increment_trip_usage",
  { user_id_input: userId }
)

if (creditError) {
  console.error("Credit error:", creditError)
  return NextResponse.json(
    { error: "Credit system error" },
    { status: 500 }
  )
}

if (!creditOk) {
  return NextResponse.json(
    {
      error: "TRIP_LIMIT_REACHED",
      redirect: "/subscribe"
    },
    { status: 403 }
  )
}

/* ---------- Save trip ---------- */

await supabase.from("trips").insert({
user_id:userId,
destination,
itinerary_json:trip
})



// 🔥 release lock after success
await supabase.rpc("release_ai_lock", {
  user_id_input: userId
})

return NextResponse.json(trip)


}catch(err){

console.error("Trip generation error:",err)

// 🔥 FAIL-SAFE: release lock if error happens
try {
  const authHeader = req.headers.get("authorization")

  if (authHeader) {
    const token = authHeader.replace("Bearer ","")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { global:{ headers:{ Authorization:`Bearer ${token}` } } }
    )

    const { data:{ user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.rpc("release_ai_lock", {
        user_id_input: user.id
      })
    }
  }

} catch(e){
  console.log("Lock release failed (safe ignore)")
}

return NextResponse.json(
{error:"Trip generation failed"},
{status:500}
)

}

}