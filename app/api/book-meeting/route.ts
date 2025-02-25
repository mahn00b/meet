import { NextResponse } from "next/server"
import { google } from "googleapis"
import { JWT } from "google-auth-library"

// These would typically be environment variables
const GOOGLE_PRIVATE_KEY = "YOUR_PRIVATE_KEY"
const GOOGLE_CLIENT_EMAIL = "YOUR_CLIENT_EMAIL"
const GOOGLE_PROJECT_NUMBER = "YOUR_PROJECT_NUMBER"
const GOOGLE_CALENDAR_ID = "YOUR_CALENDAR_ID"

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"]

const jwtClient = new JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: SCOPES,
})

const calendar = google.calendar({ version: "v3", auth: jwtClient })

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, start, end } = body

  if (!name || !email || !start || !end) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const event = {
      summary: `Meeting with ${name}`,
      description: `Meeting booked by ${name} (${email})`,
      start: {
        dateTime: start,
        timeZone: "UTC",
      },
      end: {
        dateTime: end,
        timeZone: "UTC",
      },
      attendees: [{ email }],
    }

    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: event,
    })

    return NextResponse.json({ message: "Meeting booked successfully", eventId: response.data.id })
  } catch (error) {
    console.error("Error booking meeting:", error)
    return NextResponse.json({ error: "Failed to book meeting" }, { status: 500 })
  }
}

