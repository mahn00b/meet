import { NextResponse } from "next/server"
import { getAvailability } from "@/lib/googleCalendar"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const start = searchParams.get("start")
  const end = searchParams.get("end")

  if (!start || !end) {
    return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 })
  }

  try {
    const availability = await getAvailability(new Date(start), new Date(end))
    return NextResponse.json(availability)
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}

