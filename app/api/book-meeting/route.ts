import { NextResponse } from "next/server"
import { createEvent } from "@/lib/googleCalendar"
import { create } from "domain"

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
    const meeting = await createEvent({
      start: new Date(start),
      end: new Date(endTime),
      title: "Meeting with " + name,
      summary: "Meeting with " + name,
      description: "Meeting booked through scheduling link",
      attendees: [
        { email, name },
      ],
    })

    return NextResponse.json({
      message: "Meeting booked successfully",
      eventId: "mock-event-id-" + meeting.id,
    })
  } catch (error) {
    console.error("Error booking meeting:", error)
    return NextResponse.json({ error: "Failed to book meeting" }, { status: 500 })
  }
}

