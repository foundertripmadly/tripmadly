import PlannerHero from "@/components/planner/PlannerHero"
import PlannerLayout from "@/components/planner/PlannerLayout"

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">

      <PlannerHero />

      <PlannerLayout />

    </div>
  )
}