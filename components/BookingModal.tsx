"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSlot: Date | null
}

export default function BookingModal({ isOpen, onClose, selectedSlot }: BookingModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) {
      toast({
        title: "Error",
        description: "No time slot selected.",
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
        body: JSON.stringify({
          name,
          email,
          start: selectedSlot.toISOString(),
          end: new Date(selectedSlot.getTime() + 60 * 60 * 1000).toISOString(), // Assume 1-hour meetings
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your meeting has been booked!",
        })
        // Reset form and close modal
        setName("")
        setEmail("")
        onClose()
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book a Meeting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Booking..." : "Book Meeting"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

