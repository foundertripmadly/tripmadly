"use client"

import { useState } from "react"
import PlannerForm from "./PlannerForm"
import PlannerResults from "./PlannerResults"
import type { TripData } from "@/lib/types"
import { generateTrip } from "@/lib/ai"

export default function PlannerLayout() {

  const [tripData, setTripData] = useState<TripData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (formData: {
    destination: string
    days: number
    budget: string
  }) => {

    try {

      setLoading(true)
      setTripData(null)

      const result = await generateTrip(formData)

      // ✅ IMPORTANT FIX (DO NOT REMOVE)
      if (!result) return;

      setTripData(result)

      setTimeout(() => {
        window.scrollTo({
          top: 650,
          behavior: "smooth"
        })
      }, 300)

    } catch (error: any) {

      console.error("Trip generation failed:", error)

      // ✅ CLEAN ERROR HANDLING
      alert(error?.message || "Trip generation failed. Please try again.")

    } finally {

      setLoading(false)

    }

  }

  return (

    <section className="max-w-7xl mx-auto px-6 py-16">

      {/* Planner Form */}
      <PlannerForm
        onGenerate={handleGenerate}
        loading={loading}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <p className="mt-6 text-gray-700 font-semibold">
            Curating your Experience...
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && tripData && (
        <div className="mt-16">
          <PlannerResults trip={tripData} />
        </div>
      )}

    </section>

  )

}