import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    // Get the admin password from environment variables
    const adminPassword = process.env.ADMIN_PAGE_SECRET

    if (!adminPassword) {
      console.error("ADMIN_PAGE_SECRET environment variable is not set")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error verifying admin password:", error)
    return NextResponse.json({ error: "Failed to verify password" }, { status: 500 })
  }
}

