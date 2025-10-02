"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import { Users, UserCheck, Calendar, AlertTriangle, Home, Settings, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Inmates", href: "/inmates", icon: Users },
  { name: "Visitors", href: "/visitors", icon: UserCheck },
  { name: "Visits", href: "/visits", icon: Calendar },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        {/* Logo */}
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Artificial Ledger</h2>
              <p className="text-xs text-muted-foreground">Digital Records</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-3 py-2">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="px-3">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
            <ScrollArea className="h-[300px]">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", isActive && "bg-muted font-medium")}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                )
              })}
            </ScrollArea>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-3 pt-4 border-t">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
