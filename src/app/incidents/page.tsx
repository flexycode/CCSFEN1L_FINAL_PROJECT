"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { apiClient } from "@/lib/api-client"
import { Plus, Search, Filter, Eye, Edit, AlertTriangle, Shield, Activity, FileX } from "lucide-react"
import { IncidentForm } from "@/components/incidents/incident-form"
import { IncidentDetails } from "@/components/incidents/incident-details"

interface Incident {
  incidentid: string
  pdl_id: string
  incidentdate: string
  natureofincident: string
  incidentdesc: string
  inmate_fname: string
  inmate_lname: string
  created_at: string
}

export default function IncidentsPage() {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [natureFilter, setNatureFilter] = useState("all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [showForm, setShowForm] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const canEdit = user?.role === "admin" || user?.role === "officer"

  useEffect(() => {
    fetchIncidents()
  }, [pagination.page, search, natureFilter])

  const fetchIncidents = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getIncidents({
        page: pagination.page,
        limit: pagination.limit,
        nature: natureFilter === "all" ? "" : natureFilter,
      })

      if (response.success) {
        setIncidents(response.data || [])
        if (response.pagination) {
          setPagination(response.pagination)
        }
      }
    } catch (error) {
      console.error("Failed to fetch incidents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleNatureFilter = (value: string) => {
    setNatureFilter(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedIncident(null)
    fetchIncidents()
  }

  const getSeverityColor = (nature: string) => {
    const lowerNature = nature?.toLowerCase() || ""
    if (lowerNature.includes("fight") || lowerNature.includes("violence") || lowerNature.includes("assault")) {
      return "destructive"
    }
    if (lowerNature.includes("medical") || lowerNature.includes("emergency")) {
      return "default"
    }
    if (lowerNature.includes("disturbance") || lowerNature.includes("argument")) {
      return "secondary"
    }
    return "outline"
  }

  const columns = [
    {
      key: "incidentid",
      header: "Incident ID",
    },
    {
      key: "inmate_info",
      header: "Involved Inmate",
      render: (_: any, row: Incident) => (
        <div>
          <p className="font-medium">{`${row.inmate_lname}, ${row.inmate_fname}`}</p>
          <p className="text-sm text-muted-foreground">ID: {row.pdl_id}</p>
        </div>
      ),
    },
    {
      key: "incidentdate",
      header: "Date & Time",
      render: (value: string) => (
        <div>
          <p className="font-medium">{new Date(value).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground">{new Date(value).toLocaleTimeString()}</p>
        </div>
      ),
    },
    {
      key: "natureofincident",
      header: "Nature",
      render: (value: string) => <Badge variant={getSeverityColor(value)}>{value}</Badge>,
    },
    {
      key: "incidentdesc",
      header: "Description",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Reported",
      render: (value: string) => (
        <div className="text-sm text-muted-foreground">{new Date(value).toLocaleDateString()}</div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Incident) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedIncident(row)
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
                setSelectedIncident(row)
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

  // Get incident statistics
  const incidentStats = incidents.reduce(
    (acc, incident) => {
      const nature = incident.natureofincident?.toLowerCase() || ""
      if (nature.includes("fight") || nature.includes("violence") || nature.includes("assault")) {
        acc.violence++
      } else if (nature.includes("medical") || nature.includes("emergency")) {
        acc.medical++
      } else if (nature.includes("disturbance") || nature.includes("argument")) {
        acc.disturbance++
      } else {
        acc.other++
      }
      return acc
    },
    { violence: 0, medical: 0, disturbance: 0, other: 0 },
  )

  // Get recent incidents (last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const recentIncidents = incidents.filter((incident) => new Date(incident.incidentdate) >= weekAgo)

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Incident Management</h1>
            <p className="text-muted-foreground">Document and track facility incidents</p>
          </div>
          {canEdit && (
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedIncident(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Report Incident
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedIncident ? "Edit Incident" : "Report New Incident"}</DialogTitle>
                  <DialogDescription>
                    {selectedIncident
                      ? "Update incident information and details."
                      : "Document a new incident with complete details."}
                  </DialogDescription>
                </DialogHeader>
                <IncidentForm
                  incident={selectedIncident}
                  onSuccess={handleFormSuccess}
                  onCancel={() => setShowForm(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
              <p className="text-xs text-muted-foreground">{recentIncidents.length} this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Violence/Fights</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{incidentStats.violence}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical/Emergency</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{incidentStats.medical}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disturbances</CardTitle>
              <FileX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{incidentStats.disturbance}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={natureFilter} onValueChange={handleNatureFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by nature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="fight">Fights</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="disturbance">Disturbance</SelectItem>
                    <SelectItem value="violence">Violence</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents Log</CardTitle>
            <CardDescription>Complete record of all facility incidents and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={incidents}
              columns={columns}
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Incident Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Incident Details</DialogTitle>
              <DialogDescription>Complete information for incident {selectedIncident?.incidentid}</DialogDescription>
            </DialogHeader>
            {selectedIncident && <IncidentDetails incident={selectedIncident} onClose={() => setShowDetails(false)} />}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
