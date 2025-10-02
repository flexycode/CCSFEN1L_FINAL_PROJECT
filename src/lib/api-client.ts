interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

class ApiClient {
  private baseUrl = "/api"
  private token: string | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("artificial_ledger_token")
      console.log("[v0] ApiClient initialized with token:", this.token ? "present" : "none")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("artificial_ledger_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("artificial_ledger_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    console.log("[v0] API Request:", { url, method: options.method || "GET", hasToken: !!this.token })

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()
      console.log("[v0] API Response:", { url, status: response.status, success: data.success })
      return data
    } catch (error) {
      console.error("[v0] API Error:", { url, error })
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  // Auth methods
  async login(username: string, password: string) {
    console.log("[v0] Login attempt via API client:", { username })
    return this.request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async verifyToken() {
    return this.request<{ user: any }>("/auth/verify")
  }

  // PDL methods
  async getPDL(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.search) searchParams.set("search", params.search)
    if (params?.status) searchParams.set("status", params.status)

    return this.request(`/pdl?${searchParams}`)
  }

  async createPDL(data: any) {
    return this.request("/pdl", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Visitor methods
  async getVisitors(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.search) searchParams.set("search", params.search)

    return this.request(`/visitors?${searchParams}`)
  }

  async createVisitor(data: any) {
    return this.request("/visitors", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Visit methods
  async getVisits(params?: { page?: number; limit?: number; date?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.date) searchParams.set("date", params.date)

    return this.request(`/visits?${searchParams}`)
  }

  async createVisit(data: any) {
    return this.request("/visits", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Incident methods
  async getIncidents(params?: { page?: number; limit?: number; nature?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.nature) searchParams.set("nature", params.nature)

    return this.request(`/incidents?${searchParams}`)
  }

  async createIncident(data: any) {
    return this.request("/incidents", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()
