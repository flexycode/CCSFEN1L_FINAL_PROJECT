import type { NextRequest } from "next/server"
import { sql, generateVisitId } from "@/lib/database"
import { getUserFromRequest } from "@/lib/simple-auth"

export async function GET(request: NextRequest) {
  console.log("[v0] Visits GET API route called")

  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      console.log("[v0] Visits GET: Authentication failed")
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log("[v0] Visits GET: User authorized:", {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    })

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const date = searchParams.get("date") || ""

    console.log("[v0] Visits GET: Query params:", { page, limit, date })

    const offset = (page - 1) * limit

    let visits
    if (date) {
      visits = await sql`
        SELECT 
          v.*,
          p.Fname as inmate_fname,
          p.Lname as inmate_lname,
          vp.Fname as visitor_fname,
          vp.Lname as visitor_lname
        FROM DateOfVisits v
        LEFT JOIN PDL p ON v.InmateID = p.PDL_ID
        LEFT JOIN VisitorsProfile vp ON v.VisitorID = vp.VisitorID
        WHERE DATE(v.VisitDate) = ${date}
        ORDER BY v.VisitDate DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      visits = await sql`
        SELECT 
          v.*,
          p.Fname as inmate_fname,
          p.Lname as inmate_lname,
          vp.Fname as visitor_fname,
          vp.Lname as visitor_lname
        FROM DateOfVisits v
        LEFT JOIN PDL p ON v.InmateID = p.PDL_ID
        LEFT JOIN VisitorsProfile vp ON v.VisitorID = vp.VisitorID
        ORDER BY v.VisitDate DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    console.log("[v0] Visits query executed successfully, rows:", visits.length)

    // Get total count
    let totalResult
    if (date) {
      totalResult = await sql`
        SELECT COUNT(*) as total 
        FROM DateOfVisits 
        WHERE DATE(VisitDate) = ${date}
      `
    } else {
      totalResult = await sql`
        SELECT COUNT(*) as total 
        FROM DateOfVisits
      `
    }

    const total = Number(totalResult[0].total)
    console.log("[v0] Visits total count:", total)

    console.log("[v0] Visits GET response prepared successfully")

    return Response.json({
      success: true,
      data: visits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Visits GET error:", error)
    return Response.json({ error: "Failed to fetch visits" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("[v0] Visits POST API route called")

  try {
    const user = await getUserFromRequest(request)
    if (!user || !["admin", "officer"].includes(user.role)) {
      console.log("[v0] Visits POST: Authentication failed or insufficient permissions")
      return Response.json({ error: "Authentication required or insufficient permissions" }, { status: 401 })
    }

    console.log("[v0] Visits POST: User authorized:", { id: user.id, username: user.username, role: user.role })

    const data = await request.json()
    console.log("[v0] Visits POST: Request data:", data)

    const visitId = generateVisitId()
    console.log("[v0] Generated visit ID:", visitId)

    const result = await sql`
      INSERT INTO DateOfVisits (
        VisitID, InmateID, VisitorID, VisitDate, Purpose, DutyPersonnel
      ) VALUES (
        ${visitId}, ${data.inmateid}, ${data.visitorid}, ${data.visitdate}, ${data.purpose}, ${data.dutypersonnel}
      ) RETURNING *
    `

    console.log("[v0] Visit created successfully:", result[0])

    return Response.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Visit creation error:", error)
    return Response.json({ error: "Failed to create visit record" }, { status: 500 })
  }
}
