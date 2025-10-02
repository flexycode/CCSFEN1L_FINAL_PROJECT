import type { NextRequest } from "next/server"

export interface User {
  id: string
  username: string
  role: "admin" | "officer" | "viewer"
  name: string
}

// Mock users for demo - in production, this would be in database
const MOCK_USERS: User[] = [
  { id: "1", username: "admin", role: "admin", name: "System Administrator" },
  { id: "2", username: "officer1", role: "officer", name: "Duty Officer 1" },
  { id: "3", username: "viewer1", role: "viewer", name: "Records Viewer" },
]

// Simple session storage (in production, use Redis or database)
const activeSessions = new Map<string, { user: User; expires: number }>()

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function createSession(user: User): string {
  const token = generateSessionToken()
  const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  activeSessions.set(token, { user, expires })
  console.log("[v0] Session created for user:", user.username)
  return token
}

export function validateSession(token: string): User | null {
  const session = activeSessions.get(token)

  if (!session) {
    console.log("[v0] No session found for token")
    return null
  }

  if (Date.now() > session.expires) {
    console.log("[v0] Session expired")
    activeSessions.delete(token)
    return null
  }

  console.log("[v0] Valid session found for user:", session.user.username)
  return session.user
}

export function authenticateUser(username: string, password: string): User | null {
  const mockPasswords: Record<string, string> = {
    admin: "admin123",
    officer1: "officer123",
    viewer1: "viewer123",
  }

  console.log("[v0] Authenticating user:", username)
  if (mockPasswords[username] === password) {
    const user = MOCK_USERS.find((u) => u.username === username) || null
    console.log("[v0] Authentication successful for:", username)
    return user
  }
  console.log("[v0] Authentication failed for:", username)
  return null
}

export function getUserFromRequest(request: NextRequest): User | null {
  try {
    const authHeader = request.headers.get("authorization")
    console.log("[v0] Auth header present:", !!authHeader)

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("[v0] No valid Bearer token found")
      return null
    }

    const token = authHeader.substring(7)
    console.log("[v0] Extracted token length:", token.length)

    return validateSession(token)
  } catch (error) {
    console.error("[v0] Error in getUserFromRequest:", error)
    return null
  }
}
