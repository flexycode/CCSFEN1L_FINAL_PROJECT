import type { NextRequest } from "next/server"
import { getUserFromRequest } from "@/lib/simple-auth"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Verify API route called")

    let user
    try {
      user = getUserFromRequest(request)
      console.log("[v0] getUserFromRequest completed:", user ? "User found" : "No user")
    } catch (getUserError) {
      console.error("[v0] Error in getUserFromRequest:", getUserError)
      return Response.json({ success: false, error: "Token processing failed" }, { status: 500 })
    }

    if (!user) {
      console.log("[v0] Session verification failed - no user found")
      return Response.json({ success: false, error: "Invalid session" }, { status: 401 })
    }

    console.log("[v0] Session verification successful:", user.username)
    return Response.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name,
        },
      },
    })
  } catch (error) {
    console.error("[v0] Unexpected verify error:", error)
    return Response.json({ success: false, error: "Session verification failed" }, { status: 500 })
  }
}
