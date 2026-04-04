export interface TimeBlock {
  place?: string
  activity?: string
  food?: string
  transport?: string
  tip?: string
}

export interface DayPlan {
  day: number
  title: string
  vibe: string
  morning: TimeBlock
  afternoon: TimeBlock
  evening: TimeBlock
}

export interface Hotel {
  name: string
  location: string
  rating: number
  image: string
}

export interface Destination {
  name: string
  image: string
}

export interface TripData {
  trip_title: string
  summary: string
  currency: string
  total_estimated_cost: number
  cover_image: string
  daily_plan: DayPlan[]
  hotels: Hotel[]
  destinations: Destination[]
  map_points?: {
  lat: number
  lng: number
  name: string
  type?: string
}[]
}