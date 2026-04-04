"use client"

import { useState } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import TripPDF from "../pdf/TripPDF"
import type { TripData } from "@/lib/types"

export default function PlannerResults({ trip }: { trip: TripData }) {

  const [activeDay, setActiveDay] = useState(1)

  if (!trip) return null

  const day = trip.daily_plan?.find((d) => d.day === activeDay) || trip.daily_plan?.[0]

  const currencySymbols: Record<string,string> = {
    INR: "₹",
    USD: "$",
    GBP: "£",
    EUR: "€",
    AED: "AED",
    JPY: "¥",
    SGD: "S$",
    AUD: "A$",
    CAD: "C$"
  }

  const currencySymbol = currencySymbols[trip.currency] || "$"

  const hotel = trip.hotels?.[0]
  const place = trip.destinations?.[0]

  const coverImage =
    trip.cover_image ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"

  return (

<div className="mt-20 space-y-10">

{/* HERO */}

<div className="h-[420px] rounded-2xl overflow-hidden relative">

<img
src={coverImage}
alt="Destination"
className="absolute inset-0 w-full h-full object-cover"
loading="lazy"
referrerPolicy="no-referrer"
/>

<div className="absolute inset-0 bg-black/40"></div>

<div className="absolute bottom-10 left-10 text-white max-w-xl">

<h2 className="text-4xl font-bold">
{trip.trip_title}
</h2>

<p className="mt-3 text-sm opacity-90">
{trip.summary}
</p>

</div>

<div className="absolute right-10 bottom-10 bg-black/40 backdrop-blur-md rounded-xl px-6 py-4 text-white">

<p className="text-xs opacity-80">EST. COST</p>

<p className="text-2xl font-bold">
{currencySymbol} {trip.total_estimated_cost}
</p>

</div>

</div>


{/* DAY TABS */}

<div className="flex gap-3 overflow-x-auto">

{trip.daily_plan?.map((d)=>(

<button
key={d.day}
onClick={()=>setActiveDay(d.day)}
className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
activeDay===d.day
? "bg-purple-600 text-white"
: "bg-gray-200"
}`}
>

Day {d.day}

</button>

))}

</div>


{/* MAIN GRID */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

{/* LEFT COLUMN */}

<div className="space-y-8">

<div className="bg-white rounded-xl p-6 shadow min-h-[380px]">

<h3 className="text-xl font-semibold mb-2">
Day {day?.day} – {day?.title}
</h3>

<p className="text-sm text-gray-500 mb-6">
{day?.vibe}
</p>

{(["morning", "afternoon", "evening"] as const).map((time) => {
const block = day?.[time]

if (!block) return null

return (
<div key={time} className="border-l-2 border-purple-500 pl-4 mb-6">

<p className="text-purple-600 font-bold capitalize">
{time}
</p>

<h4 className="font-semibold">
{block.place || "Explore nearby"}
</h4>

<p className="text-sm text-gray-500 mb-2">
{block.activity || "Explore nearby"}
</p>

<p className="text-sm">
🍜 <span className="font-medium">Food:</span> {block.food || "Explore nearby"}
</p>

<p className="text-sm">
🚕 <span className="font-medium">Transport:</span> {block.transport || "Explore nearby"}
</p>

<p className="text-sm text-green-600 mt-1">
💡 {block.tip || "Explore nearby"}
</p>

</div>
)
})}

</div>

</div>


{/* RIGHT COLUMN */}

<div className="space-y-8">

<div className="bg-white rounded-xl p-6 shadow">

<PDFDownloadLink
document={<TripPDF trip={trip}/>}
fileName="tripmadly-itinerary.pdf"
>

{({loading})=>(

<button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold">
{loading ? "Preparing PDF..." : "Save PDF"}
</button>

)}

</PDFDownloadLink>

</div>


{hotel && (

<div className="bg-white rounded-xl p-6 shadow">

<h4 className="font-semibold mb-4">
Most Recommended Stay for You
</h4>

<img
src={hotel.image}
alt={hotel.name}
loading="lazy"
referrerPolicy="no-referrer"
className="rounded-lg mb-4 w-full h-48 object-cover"
/>

<p className="font-semibold text-lg">
{hotel.name}
</p>

<p className="text-sm text-gray-500">
{hotel.location}
</p>

<p className="text-yellow-500 text-sm mt-1">
⭐ {hotel.rating}
</p>

</div>

)}


{place && (

<div className="bg-white rounded-xl p-6 shadow">

<h4 className="font-semibold mb-4">
Most Recommended Place for You
</h4>

<img
src={place.image}
alt={place.name}
loading="lazy"
referrerPolicy="no-referrer"
className="rounded-lg mb-4 w-full h-48 object-cover"
/>

<p className="font-semibold text-lg">
{place.name}
</p>

</div>

)}

</div>

</div>


{/* ✅ FULL WIDTH MAP (FIXED POSITION) */}

<div className="bg-white rounded-xl p-6 shadow mt-8">

<h4 className="font-semibold mb-4">
Interactive Map
</h4>

<iframe
width="100%"
height="420"
loading="lazy"
src={`https://maps.google.com/maps?q=${
trip.map_points?.[0]?.lat || 20
},${
trip.map_points?.[0]?.lng || 77
}&z=13&output=embed`}
className="rounded-lg w-full"
/>

</div>

</div>

  )
}