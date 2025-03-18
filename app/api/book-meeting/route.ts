import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, start, end, durationMinutes } = body

  if (!name || !email || !start) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Calculate end time if not provided
  const endTime = end || new Date(new Date(start).getTime() + (durationMinutes || 30) * 60 * 1000).toISOString()

  try {
    // In a real implementation, you would connect to Google Calendar here
    // For now, we'll just simulate a successful booking
    console.log("Booking received:", {
      name,
      email,
      start,
      end: endTime,
      durationMinutes,
    })

    return NextResponse.json({
      message: "Meeting booked successfully",
      eventId: "mock-event-id-" + Date.now(),
    })
  } catch (error) {
    console.error("Error booking meeting:", error)
    return NextResponse.json({ error: "Failed to book meeting" }, { status: 500 })
  }
}

