export async function GET() {
  try {
    console.log("[v0] Test route called")
    return Response.json({ success: true, message: "Test route working" })
  } catch (error) {
    console.error("[v0] Test route error:", error)
    return Response.json({ error: "Test failed" }, { status: 500 })
  }
}
