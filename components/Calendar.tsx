"use client"

import { useEffect, useState } from "react"
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
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

interface CalendarProps {
  onSelectSlot: (date: Date | null) => void
}

export default function Calendar({ onSelectSlot }: CalendarProps) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchAvailability = async () => {
      const start = new Date()
      const end = new Date()
      end.setDate(end.getDate() + 7) // Fetch one week of availability

      try {
        const response = await fetch(`/api/availability?start=${start.toISOString()}&end=${end.toISOString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch availability")
        }
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching availability:", error)
      }
    }

    fetchAvailability()
  }, [])

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    // Check if the selected slot is available (not in the events array)
    const isAvailable = !events.some((event) => event.start <= slotInfo.start && event.end > slotInfo.start)

    if (isAvailable) {
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
    <div className="h-[600px] border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">My Availability</h2>
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
      />
    </div>
  )
}

