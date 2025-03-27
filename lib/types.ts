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
  title?: string | null | undefined
  summary?: string | null | undefined
  description?: string | null | undefined
  attendees: {
    name?: string | null | undefined;
    email?: string | null | undefined;
  }[]
}

export interface MeetingSlot {
  start: Date;
  end: Date;
}
