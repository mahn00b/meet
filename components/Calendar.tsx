"use client"

import { useState } from "react"
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import { format } from "date-fns/format"
import { parse } from "date-fns/parse"
import { startOfWeek } from "date-fns/startOfWeek"
import { getDay } from "date-fns/getDay"
import { addDays } from "date-fns/addDays"
import { enUS } from "date-fns/locale/en-US"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Generate mock busy times for the next two weeks
const generateMockBusyTimes = () => {
  const busyTimes = []
  const today = new Date()

  // Add some random busy times for the next 14 days
  for (let i = 0; i < 14; i++) {
    const day = addDays(today, i)

    // Skip weekends
    if (day.getDay() === 0 || day.getDay() === 6) continue

    // Morning meeting (9-10 AM)
    if (Math.random() > 0.5) {
      const start = new Date(day)
      start.setHours(9, 0, 0, 0)
      const end = new Date(day)
      end.setHours(10, 0, 0, 0)
      busyTimes.push({
        title: "Busy",
        start,
        end,
      })
    }

    // Lunch (12-1 PM)
    const lunchStart = new Date(day)
    lunchStart.setHours(12, 0, 0, 0)
    const lunchEnd = new Date(day)
    lunchEnd.setHours(13, 0, 0, 0)
    busyTimes.push({
      title: "Lunch",
      start: lunchStart,
      end: lunchEnd,
    })

    // Afternoon meeting (2-3 PM or 3-4 PM)
    if (Math.random() > 0.3) {
      const start = new Date(day)
      start.setHours(Math.random() > 0.5 ? 14 : 15, 0, 0, 0)
      const end = new Date(start)
      end.setHours(start.getHours() + 1, 0, 0, 0)
      busyTimes.push({
        title: "Busy",
        start,
        end,
      })
    }
  }

  return busyTimes
}

const mockBusyTimes = generateMockBusyTimes()

interface CalendarProps {
  onSelectSlot: (date: Date | null) => void
  durationMinutes?: number
}

export default function Calendar({ onSelectSlot, durationMinutes = 30 }: CalendarProps) {
  const [events] = useState(mockBusyTimes)

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    // Check if the selected slot is available (not in the events array)
    const slotEnd = new Date(slotInfo.start.getTime() + durationMinutes * 60 * 1000)

    const isAvailable = !events.some(
      (event) =>
        (event.start <= slotInfo.start && event.end > slotInfo.start) ||
        (event.start < slotEnd && event.end >= slotEnd) ||
        (slotInfo.start <= event.start && slotEnd >= event.end),
    )

    // Check if it's a weekend
    const isWeekend = slotInfo.start.getDay() === 0 || slotInfo.start.getDay() === 6

    // Check if it's outside business hours (9 AM - 5 PM)
    const hour = slotInfo.start.getHours()
    const isBusinessHours = hour >= 9 && hour < 17

    if (isAvailable && !isWeekend && isBusinessHours) {
      onSelectSlot(slotInfo.start)
    }
  }

  const eventStyleGetter = (event: any) => ({
    style: {
      backgroundColor: "#E57373", // Light red for busy slots
      color: "white",
      border: "none",
    },
  })

  return (
    <div className="h-[600px] border rounded-lg p-4" suppressHydrationWarning={true}>
      <h2 className="text-xl font-semibold mb-4">Select a Time ({durationMinutes} min)</h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        defaultView="week"
        views={["week"]}
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
        step={15}
        timeslots={4}
        min={new Date(new Date().setHours(9, 0, 0, 0))}
        max={new Date(new Date().setHours(17, 0, 0, 0))}
      />
    </div>
  )
}

