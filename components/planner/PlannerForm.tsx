"use client";

import { useState } from "react";
import { MapPin, Calendar, Wallet, Sparkles } from "lucide-react";

export default function PlannerForm({ onGenerate, loading }: any) {

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState("Budget");

  const submit = () => {
    if (!destination) return;

    onGenerate({
      destination,
      days,
      budget
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md p-6 flex flex-wrap gap-6 items-end justify-between">

      {/* DESTINATION */}
      <div className="flex flex-col flex-1 min-w-[220px]">

        <label className="text-xs font-semibold text-gray-500 flex items-center gap-2 mb-2 tracking-wide">
          <MapPin size={14} />
          DESTINATION
        </label>

        <input
          placeholder="Where to?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

      </div>


      {/* DURATION */}
      <div className="flex flex-col min-w-[150px]">

        <label className="text-xs font-semibold text-gray-500 flex items-center gap-2 mb-2 tracking-wide">
          <Calendar size={14} />
          DURATION
        </label>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="p-3 rounded-xl border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {[1,2,3,4,5,6,7,10,14].map((d)=>(
            <option key={d} value={d}>
              {d} Days
            </option>
          ))}
        </select>

      </div>


      {/* BUDGET */}
      <div className="flex flex-col min-w-[160px]">

        <label className="text-xs font-semibold text-gray-500 flex items-center gap-2 mb-2 tracking-wide">
          <Wallet size={14} />
          BUDGET
        </label>

        <select
          value={budget}
          onChange={(e)=>setBudget(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option>Budget</option>
          <option>Moderate</option>
          <option>Luxury</option>
        </select>

      </div>


      {/* BUTTON */}
      <button
        disabled={loading}
        onClick={submit}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
      >
        <Sparkles size={18} />
        Plan Trip
      </button>

    </div>
  );
}