"use client"

import { useState } from "react"
import Calendar from "../components/Calendar"
import BookingModal from "../components/BookingModal"

export default function Home() {
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSlotSelect = (slot: Date | null) => {
    setSelectedSlot(slot)
    setIsModalOpen(true)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Meet Me</h1>
      <Calendar onSelectSlot={handleSlotSelect} />
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedSlot={selectedSlot} />
    </main>
  )
}

