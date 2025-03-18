"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSlot: Date | null
  durationMinutes?: number
}

export default function BookingModal({ isOpen, onClose, selectedSlot, durationMinutes = 30 }: BookingModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const endTime = selectedSlot ? new Date(selectedSlot.getTime() + durationMinutes * 60 * 1000) : null

  const formatTimeRange = () => {
    if (!selectedSlot || !endTime) return "No slot selected"

    const dateStr = format(selectedSlot, "EEEE, MMMM d, yyyy")
    const startTimeStr = format(selectedSlot, "h:mm a")
    const endTimeStr = format(endTime, "h:mm a")

    return `${dateStr} from ${startTimeStr} to ${endTimeStr}`
  }

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
          end: endTime?.toISOString(),
          durationMinutes,
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
          <DialogTitle>Book a {durationMinutes}-Minute Meeting</DialogTitle>
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
            <Label>Selected Time</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm">{formatTimeRange()}</div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Booking..." : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

