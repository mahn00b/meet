import { google  } from "googleapis"

// These would typically be environment variables
async function validateAuthentication() {
  try {
    const content = (process.env.GOOGLE_CREDENTIALS as string)
    if (!content) {
      throw new Error("No Google credentials found")
    }

    const creds = Buffer.from(content, "base64").toString("utf-8")

    return JSON.parse(creds)
  } catch (error) {
    console.error("Error loading Google credentials:", error)
    return null
  }
}

async function authorize() {
  const credentials = await validateAuthentication()
  if (!credentials) {
    throw new Error("No Google credentials found")
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  })

  return auth
}

export async function getAvailability(from: Date = new Date(), to: Date = new Date()) {
  try {
    const calendar = google.calendar({ version: "v3", auth: await authorize() })
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
  });
    const calendars = response.data.items
    return calendars
  } catch (error) {
    console.error("Error fetching user calendars:", error)
    throw error
  }
}
