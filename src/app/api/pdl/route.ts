import type { NextRequest } from "next/server"
import { sql, generatePDLId } from "@/lib/database"
import { getUserFromRequest } from "@/lib/simple-auth"

export async function GET(request: NextRequest) {
  console.log("[v0] PDL GET API route called")

  try {
    const user = getUserFromRequest(request)
    console.log("[v0] User from request:", user?.username || "none")

    if (!user) {
      console.log("[v0] No authenticated user found")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["admin", "officer", "viewer"].includes(user.role)) {
      console.log("[v0] User role not authorized:", user.role)
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("[v0] User authorized, fetching PDL data")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    console.log("[v0] Query params:", { page, limit, search, status })

    const offset = (page - 1) * limit

    let inmates
    if (search && status && status !== "all") {
      inmates = await sql`
        SELECT * FROM PDL 
        WHERE (Fname ILIKE ${`%${search}%`} OR Lname ILIKE ${`%${search}%`} OR PDL_ID ILIKE ${`%${search}%`})
        AND Status = ${status}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (search) {
      inmates = await sql`
        SELECT * FROM PDL 
        WHERE (Fname ILIKE ${`%${search}%`} OR Lname ILIKE ${`%${search}%`} OR PDL_ID ILIKE ${`%${search}%`})
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (status && status !== "all") {
      inmates = await sql`
        SELECT * FROM PDL 
        WHERE Status = ${status}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      inmates = await sql`
        SELECT * FROM PDL 
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    console.log("[v0] Query executed successfully, rows:", inmates.length)

    let countResult
    if (search && status && status !== "all") {
      countResult = await sql`
        SELECT COUNT(*) as total FROM PDL 
        WHERE (Fname ILIKE ${`%${search}%`} OR Lname ILIKE ${`%${search}%`} OR PDL_ID ILIKE ${`%${search}%`})
        AND Status = ${status}
      `
    } else if (search) {
      countResult = await sql`
        SELECT COUNT(*) as total FROM PDL 
        WHERE (Fname ILIKE ${`%${search}%`} OR Lname ILIKE ${`%${search}%`} OR PDL_ID ILIKE ${`%${search}%`})
      `
    } else if (status && status !== "all") {
      countResult = await sql`
        SELECT COUNT(*) as total FROM PDL 
        WHERE Status = ${status}
      `
    } else {
      countResult = await sql`
        SELECT COUNT(*) as total FROM PDL
      `
    }

    const total = countResult[0]?.total || 0
    console.log("[v0] Total count:", total)

    const response = {
      success: true,
      data: inmates,
      pagination: {
        page,
        limit,
        total: Number.parseInt(total),
        pages: Math.ceil(total / limit),
      },
    }

    console.log("[v0] PDL GET response prepared successfully")
    return Response.json(response)
  } catch (error) {
    console.error("[v0] PDL GET error:", error)
    return Response.json({ error: "Failed to fetch inmates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("[v0] PDL POST API route called")

  try {
    const user = getUserFromRequest(request)
    console.log("[v0] User from request:", user?.username || "none")

    if (!user) {
      console.log("[v0] No authenticated user found")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["admin", "officer"].includes(user.role)) {
      console.log("[v0] User role not authorized for POST:", user.role)
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("[v0] User authorized, creating PDL record")

    const data = await request.json()
    console.log("[v0] Request data received:", Object.keys(data))

    const pdlId = generatePDLId()
    console.log("[v0] Generated PDL ID:", pdlId)

    const result = await sql`
      INSERT INTO PDL (
        PDL_ID, Fname, Lname, Mname, DOB, Gender, Nationality, Occupation,
        AgeduringArrest, Education, DetaineePic, DateOfArrest, ArrestingUnit,
        PlaceOfArrest, AttachedFile, CasesFiled, PlaceCaseFiled, DocketNumber,
        CCNum_ISNum, ProsRTCBranch, Status, Remarks
      ) VALUES (
        ${pdlId}, ${data.fname}, ${data.lname}, ${data.mname}, ${data.dob}, 
        ${data.gender}, ${data.nationality}, ${data.occupation}, ${data.ageduringarrest}, 
        ${data.education}, ${data.detaineepic}, ${data.dateofarrest}, ${data.arrestingunit},
        ${data.placeofarrest}, ${data.attachedfile}, ${data.casesfiled}, ${data.placecasefiled}, 
        ${data.docketnumber}, ${data.ccnum_isnum}, ${data.prosrtcbranch}, ${data.status}, ${data.remarks}
      ) RETURNING *
    `

    console.log("[v0] PDL record created successfully")
    return Response.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] PDL POST error:", error)
    return Response.json({ error: "Failed to create inmate record" }, { status: 500 })
  }
}
