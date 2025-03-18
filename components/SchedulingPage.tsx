"use client"

import { useState } from "react"
import type { SchedulingLink } from "@/lib/types"
// import Calendar from "./Calendar"
import BookingModal from "./BookingModal"
import dynamic from 'next/dynamic'

const Calendar = dynamic(() => import('./Calendar'), { ssr: false })

interface SchedulingPageProps {
  link: SchedulingLink
}

export default function SchedulingPage({ link }: SchedulingPageProps) {
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSlotSelect = (slot: Date | null) => {
    setSelectedSlot(slot)
    setIsModalOpen(true)
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{link.title}</h1>
          {link.description && <p className="text-gray-600">{link.description}</p>}
          <p className="text-sm text-gray-500 mt-2">Duration: {link.durationMinutes} minutes</p>
        </div>
        <div suppressHydrationWarning={true}>
        </div>
        <Calendar onSelectSlot={handleSlotSelect} durationMinutes={link.durationMinutes} />

        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedSlot={selectedSlot}
          durationMinutes={link.durationMinutes}
        />
      </div>
    </main>
  )
}

