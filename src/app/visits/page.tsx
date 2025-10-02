"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { apiClient } from "@/lib/api-client"
import { Plus, Calendar, Clock, Users, CheckCircle, Eye, Edit } from "lucide-react"
import { VisitForm } from "@/components/visits/visit-form"
import { VisitDetails } from "@/components/visits/visit-details"

interface Visit {
  visitid: string
  inmateid: string
  visitorid: string
  visitdate: string
  purpose: string
  dutypersonnel: string
  inmate_fname: string
  inmate_lname: string
  visitor_fname: string
  visitor_lname: string
  created_at: string
}

export default function VisitsPage() {
  const { user } = useAuth()
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [showForm, setShowForm] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const canEdit = user?.role === "admin" || user?.role === "officer"

  useEffect(() => {
    fetchVisits()
  }, [pagination.page, dateFilter])

  const fetchVisits = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getVisits({
        page: pagination.page,
        limit: pagination.limit,
        date: dateFilter,
      })

      if (response.success) {
        setVisits(response.data || [])
        if (response.pagination) {
          setPagination(response.pagination)
        }
      }
    } catch (error) {
      console.error("Failed to fetch visits:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateFilter = (value: string) => {
    setDateFilter(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedVisit(null)
    fetchVisits()
  }

  const getVisitStatus = (visitDate: string) => {
    const now = new Date()
    const visit = new Date(visitDate)
    const diffHours = (visit.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (diffHours < -2) return { status: "completed", color: "secondary" }
    if (diffHours < 0) return { status: "ongoing", color: "default" }
    if (diffHours < 24) return { status: "today", color: "destructive" }
    return { status: "scheduled", color: "outline" }
  }

  const columns = [
    {
      key: "visitid",
      header: "Visit ID",
    },
    {
      key: "visitor_info",
      header: "Visitor",
      render: (_: any, row: Visit) => (
        <div>
          <p className="font-medium">{`${row.visitor_lname}, ${row.visitor_fname}`}</p>
          <p className="text-sm text-muted-foreground">ID: {row.visitorid}</p>
        </div>
      ),
    },
    {
      key: "inmate_info",
      header: "Inmate",
      render: (_: any, row: Visit) => (
        <div>
          <p className="font-medium">{`${row.inmate_lname}, ${row.inmate_fname}`}</p>
          <p className="text-sm text-muted-foreground">ID: {row.inmateid}</p>
        </div>
      ),
    },
    {
      key: "visitdate",
      header: "Visit Date & Time",
      render: (value: string) => (
        <div>
          <p className="font-medium">{new Date(value).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground">{new Date(value).toLocaleTimeString()}</p>
        </div>
      ),
    },
    {
      key: "purpose",
      header: "Purpose",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_: any, row: Visit) => {
        const { status, color } = getVisitStatus(row.visitdate)
        return <Badge variant={color as any}>{status}</Badge>
      },
    },
    {
      key: "dutypersonnel",
      header: "Duty Personnel",
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Visit) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedVisit(row)
              setShowDetails(true)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedVisit(row)
                setShowForm(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  // Get today's visits
  const today = new Date().toISOString().split("T")[0]
  const todayVisits = visits.filter((visit) => visit.visitdate.startsWith(today))

  // Get visit statistics
  const visitStats = visits.reduce(
    (acc, visit) => {
      const { status } = getVisitStatus(visit.visitdate)
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Visit Tracking</h1>
            <p className="text-muted-foreground">Schedule and monitor inmate visits</p>
          </div>
          {canEdit && (
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedVisit(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Visit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedVisit ? "Edit Visit" : "Schedule New Visit"}</DialogTitle>
                  <DialogDescription>
                    {selectedVisit
                      ? "Update visit information and schedule."
                      : "Schedule a new visit between a visitor and inmate."}
                  </DialogDescription>
                </DialogHeader>
                <VisitForm visit={selectedVisit} onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Visits</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayVisits.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitStats.scheduled || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitStats.ongoing || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitStats.completed || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Date Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => handleDateFilter(e.target.value)}
                className="w-auto"
              />
              <Button variant="outline" onClick={() => handleDateFilter("")}>
                Clear Filter
              </Button>
              <Button variant="outline" onClick={() => handleDateFilter(today)}>
                Today's Visits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visits Schedule</CardTitle>
            <CardDescription>Complete list of scheduled and completed visits</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={visits}
              columns={columns}
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Visit Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Visit Details</DialogTitle>
              <DialogDescription>Complete information for visit {selectedVisit?.visitid}</DialogDescription>
            </DialogHeader>
            {selectedVisit && <VisitDetails visit={selectedVisit} onClose={() => setShowDetails(false)} />}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
