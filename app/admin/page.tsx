"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import type { SchedulingLink } from "@/lib/types"
import { Trash2 } from "lucide-react"
import AdminLogin from "@/components/AdminLogin"

export default function AdminPage() {
  const [links, setLinks] = useState<SchedulingLink[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = localStorage.getItem("adminAuthenticated") === "true"
    const authTime = Number.parseInt(localStorage.getItem("adminAuthTime") || "0", 10)

    // Authentication expires after 24 hours
    const isExpired = Date.now() - authTime > 24 * 60 * 60 * 1000

    if (authenticated && !isExpired) {
      setIsAuthenticated(true)
      fetchLinks()
    } else {
      // Clear expired authentication
      localStorage.removeItem("adminAuthenticated")
      localStorage.removeItem("adminAuthTime")
      setIsAuthenticated(false)
    }
  }, [])

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success)
    if (success) {
      fetchLinks()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminAuthTime")
    setIsAuthenticated(false)
  }

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/links")
      if (!response.ok) throw new Error("Failed to fetch links")
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      console.error("Error fetching links:", error)
      toast({
        title: "Error",
        description: "Failed to load scheduling links",
        variant: "destructive",
      })
    }
  }

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          slug,
          durationMinutes,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create link")
      }

      toast({
        title: "Success",
        description: "Scheduling link created successfully",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setSlug("")
      setDurationMinutes(30)

      // Refresh links
      fetchLinks()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create scheduling link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete link")

      toast({
        title: "Success",
        description: "Scheduling link deleted successfully",
      })

      // Refresh links
      fetchLinks()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete scheduling link",
        variant: "destructive",
      })
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to lowercase and replace spaces with hyphens
    const value = e.target.value.toLowerCase().replace(/\s+/g, "-")
    setSlug(value)
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Scheduling Link</CardTitle>
            <CardDescription>Create a custom link for people to schedule meetings with you</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="15-Minute Coffee Chat"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Quick chat to discuss potential collaboration"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="slug">Link Slug</Label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">meetme.com/</span>
                  <Input id="slug" value={slug} onChange={handleSlugChange} placeholder="coffee-chat" required />
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={5}
                  max={240}
                  step={5}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Link"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Scheduling Links</CardTitle>
            <CardDescription>Manage your existing scheduling links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {links.length === 0 ? (
                <p className="text-center text-gray-500">No scheduling links yet</p>
              ) : (
                links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-sm text-gray-500">{link.durationMinutes} minutes</p>
                      <a
                        href={`/${link.slug}`}
                        className="text-sm text-blue-500 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        /{link.slug}
                      </a>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

