import type { NextRequest } from "next/server"
import { sql, generateIncidentId } from "@/lib/database"
import { getUserFromRequest } from "@/lib/simple-auth"

export async function GET(request: NextRequest) {
  console.log("[v0] Incidents GET API route called")

  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      console.log("[v0] Incidents GET: Authentication failed")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Incidents GET: User authenticated:", user.username)

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const nature = searchParams.get("nature") || ""

    const offset = (page - 1) * limit

    console.log("[v0] Incidents GET: Query params:", { page, limit, nature, offset })

    let incidents
    if (nature) {
      incidents = await sql`
        SELECT 
          i.*,
          p.Fname as inmate_fname,
          p.Lname as inmate_lname
        FROM Incidents i
        LEFT JOIN PDL p ON i.PDL_ID = p.PDL_ID
        WHERE i.NatureOfIncident ILIKE ${`%${nature}%`}
        ORDER BY i.IncidentDate DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      incidents = await sql`
        SELECT 
          i.*,
          p.Fname as inmate_fname,
          p.Lname as inmate_lname
        FROM Incidents i
        LEFT JOIN PDL p ON i.PDL_ID = p.PDL_ID
        ORDER BY i.IncidentDate DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    console.log("[v0] Incidents GET: Found incidents:", incidents.length)

    // Get total count
    let totalResult
    if (nature) {
      totalResult = await sql`
        SELECT COUNT(*) as total 
        FROM Incidents 
        WHERE NatureOfIncident ILIKE ${`%${nature}%`}
      `
    } else {
      totalResult = await sql`
        SELECT COUNT(*) as total 
        FROM Incidents
      `
    }

    const total = Number(totalResult[0].total)
    console.log("[v0] Incidents GET: Total count:", total)

    return Response.json({
      success: true,
      data: incidents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Incidents GET error:", error)
    return Response.json({ error: "Failed to fetch incidents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("[v0] Incidents POST API route called")

  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      console.log("[v0] Incidents POST: Authentication failed")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin or officer role
    if (!["admin", "officer"].includes(user.role)) {
      console.log("[v0] Incidents POST: Insufficient permissions for role:", user.role)
      return Response.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    console.log("[v0] Incidents POST: User authenticated:", user.username)

    const data = await request.json()
    console.log("[v0] Incidents POST: Request data:", data)

    const incidentId = generateIncidentId()
    console.log("[v0] Incidents POST: Generated incident ID:", incidentId)

    const result = await sql`
      INSERT INTO Incidents (
        IncidentID, PDL_ID, IncidentDate, NatureOfIncident, IncidentDesc
      ) VALUES (
        ${incidentId}, ${data.pdl_id}, ${data.incidentdate}, ${data.natureofincident}, ${data.incidentdesc}
      ) RETURNING *
    `

    console.log("[v0] Incidents POST: Created incident:", result[0])

    return Response.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Incident creation error:", error)
    return Response.json({ error: "Failed to create incident record" }, { status: 500 })
  }
}
