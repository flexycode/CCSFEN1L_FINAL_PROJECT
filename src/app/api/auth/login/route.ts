import type { NextRequest } from "next/server"
import { authenticateUser, createSession } from "@/lib/simple-auth"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login API route called")

    let body
    try {
      body = await request.json()
      console.log("[v0] Request body parsed successfully")
    } catch (parseError) {
      console.error("[v0] Failed to parse request body:", parseError)
      return Response.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { username, password } = body

    console.log("[v0] Login attempt:", { username, passwordLength: password?.length })

    if (!username || !password) {
      console.log("[v0] Missing username or password")
      return Response.json({ error: "Username and password are required" }, { status: 400 })
    }

    let user
    try {
      user = authenticateUser(username, password)
      console.log("[v0] Authentication result:", user ? "Success" : "Failed")
    } catch (authError) {
      console.error("[v0] Authentication error:", authError)
      return Response.json({ error: "Authentication service error" }, { status: 500 })
    }

    if (!user) {
      console.log("[v0] Invalid credentials provided")
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    let token
    try {
      token = createSession(user)
      console.log("[v0] Session token created successfully")
    } catch (tokenError) {
      console.error("[v0] Session creation error:", tokenError)
      return Response.json({ error: "Session creation failed" }, { status: 500 })
    }

    console.log("[v0] Login successful for user:", username)
    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("[v0] Unexpected login error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
