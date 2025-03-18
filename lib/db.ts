import type { SchedulingLink } from "./types"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// In a real app, you would use a proper database
const DB_PATH = path.join(process.cwd(), "data")
const LINKS_FILE = path.join(DB_PATH, "links.json")

// Ensure the data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true })
}

// Ensure the links file exists
if (!fs.existsSync(LINKS_FILE)) {
  fs.writeFileSync(LINKS_FILE, JSON.stringify([]))
}

export async function getLinks(): Promise<SchedulingLink[]> {
  try {
    const data = fs.readFileSync(LINKS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading links:", error)
    return []
  }
}

export async function getLinkBySlug(slug: string): Promise<SchedulingLink | null> {
  const links = await getLinks()
  return links.find((link) => link.slug === slug) || null
}

export async function createLink(link: Omit<SchedulingLink, "id" | "createdAt">): Promise<SchedulingLink> {
  const links = await getLinks()

  // Check if slug already exists
  if (links.some((l) => l.slug === link.slug)) {
    throw new Error("Slug already exists")
  }

  const newLink: SchedulingLink = {
    ...link,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }

  links.push(newLink)
  fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2))

  return newLink
}

export async function deleteLink(id: string): Promise<boolean> {
  const links = await getLinks()
  const filteredLinks = links.filter((link) => link.id !== id)

  if (filteredLinks.length === links.length) {
    return false // No link was deleted
  }

  fs.writeFileSync(LINKS_FILE, JSON.stringify(filteredLinks, null, 2))
  return true
}

