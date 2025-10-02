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
import { Plus, Search, Filter, Eye, Edit, FileText } from "lucide-react"
import { InmateForm } from "@/components/inmates/inmate-form"
import { InmateDetails } from "@/components/inmates/inmate-details"

interface Inmate {
  pdl_id: string
  fname: string
  lname: string
  mname: string
  dob: string
  gender: string
  nationality: string
  occupation: string
  ageduringarrest: number
  education: string
  status: string
  casesfiled: string
  created_at: string
}

export default function InmatesPage() {
  const { user } = useAuth()
  const [inmates, setInmates] = useState<Inmate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [showForm, setShowForm] = useState(false)
  const [selectedInmate, setSelectedInmate] = useState<Inmate | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const canEdit = user?.role === "admin" || user?.role === "officer"

  useEffect(() => {
    fetchInmates()
  }, [pagination.page, search, statusFilter])

  const fetchInmates = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getPDL({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status: statusFilter,
      })

      if (response.success) {
        setInmates(response.data || [])
        if (response.pagination) {
          setPagination(response.pagination)
        }
      }
    } catch (error) {
      console.error("Failed to fetch inmates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedInmate(null)
    fetchInmates()
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "detained":
        return "destructive"
      case "released":
        return "secondary"
      case "transferred":
        return "outline"
      default:
        return "default"
    }
  }

  const columns = [
    {
      key: "pdl_id",
      header: "PDL ID",
    },
    {
      key: "fullname",
      header: "Full Name",
      render: (_: any, row: Inmate) => (
        <div>
          <p className="font-medium">{`${row.lname}, ${row.fname} ${row.mname || ""}`}</p>
          <p className="text-sm text-muted-foreground">{row.gender === "M" ? "Male" : "Female"}</p>
        </div>
      ),
    },
    {
      key: "ageduringarrest",
      header: "Age",
    },
    {
      key: "nationality",
      header: "Nationality",
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <Badge variant={getStatusColor(value)}>{value}</Badge>,
    },
    {
      key: "casesfiled",
      header: "Cases Filed",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Inmate) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedInmate(row)
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
                setSelectedInmate(row)
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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inmate Management</h1>
            <p className="text-muted-foreground">Manage persons deprived of liberty (PDL) records</p>
          </div>
          {canEdit && (
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedInmate(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Inmate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedInmate ? "Edit Inmate" : "Add New Inmate"}</DialogTitle>
                  <DialogDescription>
                    {selectedInmate
                      ? "Update inmate information and case details."
                      : "Enter inmate information and case details."}
                  </DialogDescription>
                </DialogHeader>
                <InmateForm inmate={selectedInmate} onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inmates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Detained</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inmates.filter((i) => i.status?.toLowerCase() === "detained").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Released</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inmates.filter((i) => i.status?.toLowerCase() === "released").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transferred</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inmates.filter((i) => i.status?.toLowerCase() === "transferred").length}
              </div>
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
                    placeholder="Search by name or PDL ID..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="detained">Detained</SelectItem>
                    <SelectItem value="released">Released</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inmates List</CardTitle>
            <CardDescription>Complete list of persons deprived of liberty with their case information</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={inmates}
              columns={columns}
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Inmate Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Inmate Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedInmate?.fname} {selectedInmate?.lname}
              </DialogDescription>
            </DialogHeader>
            {selectedInmate && <InmateDetails inmate={selectedInmate} onClose={() => setShowDetails(false)} />}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
