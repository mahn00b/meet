import { google, type calendar_v3 } from "googleapis"
import { Meeting } from "./types"

function googleEventToMeeting(events: calendar_v3.Schema$Event[]): Meeting[] {
  return events.map((event) => {
    const { start, end, summary, description, attendees = [] } = event
    const st = start?.dateTime || start?.date;
    const ed = end?.dateTime || end?.date;
    return {
      start: new Date(st as string),
      end: new Date(ed as string),
      title: summary ?? `Meeting on ${new Date(st as string).toDateString()} at ${new Date(st as string).toLocaleTimeString()}`,
      summary,
      description,
      attendees: attendees.map(({ email, displayName }) => ({ email, name: displayName })) || [],
    }
  })
}

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

export async function getAvailability(from: Date = new Date(), to: Date = new Date()): Promise<Meeting[]> {
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
    return googleEventToMeeting(calendars ?? [])
  } catch (error) {
    console.error("Error fetching user calendars:", error)
    throw error
  }
}

export async function createEvent(event: Meeting) {
  try {
    const {
      start,
      end,
      summary,
      description,
      attendees = [],
    } = event

    const timezone = process.env.TIMEZONE || "America/New_York"
    const organizer = {
      email: process.env.GOOGLE_CALENDAR_ID,
      displayName: process.env.DISPLAY_NAME,
      responseStatus: "accepted",
      organizer: true
    }

    const calendar = google.calendar({ version: "v3", auth: await authorize() })
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        start: { dateTime: start.toISOString(), timeZone: timezone },
        end: { dateTime: end.toISOString(), timeZone: timezone },
        summary,
        description,
        attendees: [
          ...attendees?.map(({ email, name }) => ({
            email,
            displayName: name,
            responseStatus: "needsAction"
          })),
          organizer
        ],
        reminders: {
          'useDefault': true,
          'overrides': [
            {'method': 'popup', 'minutes': 30},
            {'method': 'popup', 'minutes': 10}
          ]
        },
        conferenceData: {
          createRequest: {
            conferenceSolutionKey: {
              type: "hangoutsMeet"
            }
          }
        }
      },
    });

    return response.data
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}