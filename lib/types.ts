export interface SchedulingLink {
  id: string
  title: string
  description: string
  durationMinutes: number
  slug: string
  createdAt: string
}

export interface Meeting {
  start: Date
  end: Date
  summary?: string
  description?: string
  attendees: { name?: string, email?: string }[]
}