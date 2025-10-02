import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "artificial-ledger-secret-key-2025"

export interface User {
  id: string
  username: string
  role: "admin" | "officer" | "viewer"
  name: string
}

export interface AuthToken {
  userId: string
  username: string
  role: string
  exp: number
}

// Mock users for demo - in production, this would be in database
const MOCK_USERS: User[] = [
  { id: "1", username: "admin", role: "admin", name: "System Administrator" },
  { id: "2", username: "officer1", role: "officer", name: "Duty Officer 1" },
  { id: "3", username: "viewer1", role: "viewer", name: "Records Viewer" },
]

export function generateToken(user: User): string {
  try {
    console.log("[v0] Generating token for user:", user.username)
    console.log("[v0] JWT_SECRET available:", !!JWT_SECRET)

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      },
      JWT_SECRET,
    )

    console.log("[v0] Token generated successfully, length:", token.length)
    return token
  } catch (error) {
    console.error("[v0] Token generation failed:", error)
    throw new Error("Failed to generate authentication token")
  }
}

export function verifyToken(token: string): AuthToken | null {
  try {
    console.log("[v0] Verifying token with JWT_SECRET, token length:", token.length)
    const decoded = jwt.verify(token, JWT_SECRET) as AuthToken
    console.log("[v0] Token verified successfully for user:", decoded.username)
    return decoded
  } catch (error) {
    console.log("[v0] Token verification failed:", error instanceof Error ? error.message : "Unknown error")
    return null
  }
}

export function authenticateUser(username: string, password: string): User | null {
  // Mock authentication - in production, hash passwords properly
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

    const decoded = verifyToken(token)
    if (!decoded) {
      console.log("[v0] Token verification failed")
      return null
    }

    const user = MOCK_USERS.find((u) => u.id === decoded.userId) || null
    console.log("[v0] User found from token:", user?.username)
    return user
  } catch (error) {
    console.error("[v0] Error in getUserFromRequest:", error)
    return null
  }
}

export function requireAuth(allowedRoles: string[] = []) {
  return (request: NextRequest) => {
    const user = getUserFromRequest(request)
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    return user
  }
}
