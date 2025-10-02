import type { NextRequest } from "next/server"
import { sql, generateVisitorId } from "@/lib/database"
import { getUserFromRequest } from "@/lib/simple-auth"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Visitors GET API route called")

    const user = await getUserFromRequest(request)
    if (!user) {
      console.log("[v0] Visitors GET: Authentication failed")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Visitors GET: User authorized:", user)

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    console.log("[v0] Visitors GET: Query params:", { page, limit, search })

    const offset = (page - 1) * limit

    let visitors
    if (search) {
      visitors = await sql`
        SELECT * FROM VisitorsProfile 
        WHERE (Fname ILIKE ${`%${search}%`} OR Lname ILIKE ${`%${search}%`} OR VisitorID ILIKE ${`%${search}%`})
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      visitors = await sql`
        SELECT * FROM VisitorsProfile 
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    console.log("[v0] Visitors query executed successfully, rows:", visitors.length)

    // Get total count
    let totalResult
    if (search) {
      totalResult = await sql`
        SELECT COUNT(*) as total FROM VisitorsProfile 
        WHERE (Fname ILIKE ${`%${search}%`} OR Lname ILIKE ${`%${search}%`} OR VisitorID ILIKE ${`%${search}%`})
      `
    } else {
      totalResult = await sql`SELECT COUNT(*) as total FROM VisitorsProfile`
    }

    const total = Number(totalResult[0].total)
    console.log("[v0] Visitors total count:", total)

    const response = {
      success: true,
      data: visitors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }

    console.log("[v0] Visitors GET response prepared successfully")
    return Response.json(response)
  } catch (error) {
    console.error("[v0] Visitors GET error:", error)
    return Response.json({ error: "Failed to fetch visitors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Visitors POST API route called")

    const user = await getUserFromRequest(request)
    if (!user) {
      console.log("[v0] Visitors POST: Authentication failed")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Visitors POST: User authorized:", user)

    const data = await request.json()
    console.log("[v0] Visitors POST: Request data received")

    const visitorId = generateVisitorId()
    console.log("[v0] Visitors POST: Generated visitor ID:", visitorId)

    const result = await sql`
      INSERT INTO VisitorsProfile (
        VisitorID, Fname, Lname, Mname, Relationship, DOB, Gender,
        Nationality, Occupation, PDLtoVisit, ContactNum, Remarks, PhotoID
      ) VALUES (
        ${visitorId}, ${data.fname}, ${data.lname}, ${data.mname}, ${data.relationship}, 
        ${data.dob}, ${data.gender}, ${data.nationality}, ${data.occupation}, 
        ${data.pdltovisit}, ${data.contactnum}, ${data.remarks}, ${data.photoid}
      ) RETURNING *
    `

    console.log("[v0] Visitors POST: Visitor created successfully")
    return Response.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Visitors POST error:", error)
    return Response.json({ error: "Failed to create visitor record" }, { status: 500 })
  }
}
