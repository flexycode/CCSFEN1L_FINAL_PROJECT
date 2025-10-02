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
import { Plus, Search, Eye, Edit, Users, UserCheck, Phone, Heart } from "lucide-react"
import { VisitorForm } from "@/components/visitors/visitor-form"
import { VisitorDetails } from "@/components/visitors/visitor-details"

interface Visitor {
  visitorid: string
  fname: string
  lname: string
  mname: string
  relationship: string
  dob: string
  gender: string
  nationality: string
  occupation: string
  pdltovisit: string
  contactnum: string
  remarks: string
  created_at: string
}

export default function VisitorsPage() {
  const { user } = useAuth()
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [showForm, setShowForm] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const canEdit = user?.role === "admin" || user?.role === "officer"

  useEffect(() => {
    fetchVisitors()
  }, [pagination.page, search])

  const fetchVisitors = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getVisitors({
        page: pagination.page,
        limit: pagination.limit,
        search,
      })

      if (response.success) {
        setVisitors(response.data || [])
        if (response.pagination) {
          setPagination(response.pagination)
        }
      }
    } catch (error) {
      console.error("Failed to fetch visitors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedVisitor(null)
    fetchVisitors()
  }

  const getRelationshipColor = (relationship: string) => {
    switch (relationship?.toLowerCase()) {
      case "spouse":
        return "default"
      case "parent":
        return "secondary"
      case "child":
        return "outline"
      case "sibling":
        return "secondary"
      case "friend":
        return "outline"
      default:
        return "default"
    }
  }

  const columns = [
    {
      key: "visitorid",
      header: "Visitor ID",
    },
    {
      key: "fullname",
      header: "Full Name",
      render: (_: any, row: Visitor) => (
        <div>
          <p className="font-medium">{`${row.lname}, ${row.fname} ${row.mname || ""}`}</p>
          <p className="text-sm text-muted-foreground">{row.gender === "M" ? "Male" : "Female"}</p>
        </div>
      ),
    },
    {
      key: "relationship",
      header: "Relationship",
      render: (value: string) => <Badge variant={getRelationshipColor(value)}>{value}</Badge>,
    },
    {
      key: "pdltovisit",
      header: "PDL to Visit",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "contactnum",
      header: "Contact",
      render: (value: string) => (
        <div className="flex items-center">
          <Phone className="h-3 w-3 mr-1" />
          {value || "N/A"}
        </div>
      ),
    },
    {
      key: "nationality",
      header: "Nationality",
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Visitor) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedVisitor(row)
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
                setSelectedVisitor(row)
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

  // Get relationship statistics
  const relationshipStats = visitors.reduce(
    (acc, visitor) => {
      const rel = visitor.relationship?.toLowerCase() || "other"
      acc[rel] = (acc[rel] || 0) + 1
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
            <h1 className="text-3xl font-bold tracking-tight">Visitor Management</h1>
            <p className="text-muted-foreground">Manage visitor registrations and profiles</p>
          </div>
          {canEdit && (
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedVisitor(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Visitor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedVisitor ? "Edit Visitor" : "Add New Visitor"}</DialogTitle>
                  <DialogDescription>
                    {selectedVisitor
                      ? "Update visitor information and contact details."
                      : "Enter visitor information and contact details."}
                  </DialogDescription>
                </DialogHeader>
                <VisitorForm
                  visitor={selectedVisitor}
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
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Family Members</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(relationshipStats.spouse || 0) +
                  (relationshipStats.parent || 0) +
                  (relationshipStats.child || 0) +
                  (relationshipStats.sibling || 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Friends</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relationshipStats.friend || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Others</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relationshipStats.other || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or visitor ID..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visitors List</CardTitle>
            <CardDescription>Complete list of registered visitors with their contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={visitors}
              columns={columns}
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Visitor Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Visitor Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedVisitor?.fname} {selectedVisitor?.lname}
              </DialogDescription>
            </DialogHeader>
            {selectedVisitor && <VisitorDetails visitor={selectedVisitor} onClose={() => setShowDetails(false)} />}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
