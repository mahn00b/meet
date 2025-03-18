import { NextResponse } from "next/server"
import { getLinks, createLink } from "@/lib/db"

export async function GET() {
  try {
    const links = await getLinks()
    return NextResponse.json(links)
  } catch (error) {
    console.error("Error fetching links:", error)
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, slug, durationMinutes } = body

    if (!title || !slug || !durationMinutes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        {
          error: "Slug can only contain lowercase letters, numbers, and hyphens",
        },
        { status: 400 },
      )
    }

    const newLink = await createLink({
      title,
      description: description || "",
      slug,
      durationMinutes: Number(durationMinutes),
    })

    return NextResponse.json(newLink, { status: 201 })
  } catch (error: any) {
    console.error("Error creating link:", error)
    return NextResponse.json(
      {
        error: "Failed to create link",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

