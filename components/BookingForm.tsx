"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function BookingForm({ selectedSlot }: { selectedSlot: Date | null }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) {
      toast({
        title: "Error",
        description: "Please select a time slot before booking.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)

    try {
      const response = await fetch("/api/book-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, selectedSlot }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your meeting has been booked!",
        })
        // Reset form
        setName("")
        setEmail("")
      } else {
        throw new Error("Failed to book meeting")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Book a Meeting</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label>Selected Time Slot</Label>
          <Input value={selectedSlot ? selectedSlot.toLocaleString() : "No slot selected"} readOnly />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || !selectedSlot}>
          {isLoading ? "Booking..." : "Book Meeting"}
        </Button>
      </div>
    </form>
  )
}

