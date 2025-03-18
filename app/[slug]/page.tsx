import { getLinkBySlug } from "@/lib/db"
import { notFound } from "next/navigation"
import SchedulingPage from "@/components/SchedulingPage"

export default async function SchedulingLinkPage({ params }: { params: { slug: string } }) {
  const link = await getLinkBySlug(params.slug)

  if (!link) {
    notFound()
  }

  return (
    <div suppressHydrationWarning={true}>
      <SchedulingPage link={link} />
    </div>
  )
}

