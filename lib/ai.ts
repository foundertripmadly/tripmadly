import { supabase } from "@/lib/supabase";
import type { TripData } from "@/lib/types";

export async function generateTrip(data: {
  destination: string;
  days: number;
  budget: string;
}): Promise<TripData | null> {

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Session error:", sessionError);
    throw new Error("Failed to get session");
  }

  if (!session) {
    throw new Error("User not logged in");
  }

  const response = await fetch("/api/generate-trip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  });

  // 🔥 HANDLE ALL ERROR CASES PROPERLY
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error:", errorText);

    // ✅ 403 = SUBSCRIPTION / CREDIT EXHAUSTED
    if (response.status === 403) {
      window.location.href = "/subscribe";
      return null;
    }

    // ✅ 429 = RATE LIMIT / LOCK (show message only)
    if (response.status === 429) {
      throw new Error("Please wait before generating another trip.");
    }

    // ❌ OTHER ERRORS
    throw new Error("Failed to generate trip");
  }

  const result: TripData = await response.json();

  return result;
}