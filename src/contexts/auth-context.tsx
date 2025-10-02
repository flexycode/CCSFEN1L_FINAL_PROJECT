"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  username: string
  role: "admin" | "officer" | "viewer"
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log("[v0] Checking authentication status")
      const response = await apiClient.verifyToken()
      if (response.success && response.data?.user) {
        console.log("[v0] User authenticated:", response.data.user.username)
        setUser(response.data.user)
      } else {
        console.log("[v0] No valid authentication found")
      }
    } catch (error) {
      console.error("[v0] Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      console.log("[v0] Login attempt in auth context:", { username })
      const response = await apiClient.login(username, password)
      console.log("[v0] Login response:", { success: response.success, error: response.error })

      if (response.success && response.token && response.user) {
        apiClient.setToken(response.token)
        setUser(response.user)
        console.log("[v0] Login successful, user set:", response.user.username)
        return { success: true }
      }
      return { success: false, error: response.error || "Login failed" }
    } catch (error) {
      console.error("[v0] Login error in auth context:", error)
      return { success: false, error: "Network error" }
    }
  }

  const logout = () => {
    apiClient.clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
