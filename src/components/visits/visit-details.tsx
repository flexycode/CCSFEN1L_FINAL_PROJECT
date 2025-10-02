"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Calendar, Users, Clock, User, FileText } from "lucide-react"

interface VisitDetailsProps {
  visit: any
  onClose: () => void
}

export function VisitDetails({ visit, onClose }: VisitDetailsProps) {
  const getVisitStatus = (visitDate: string) => {
    const now = new Date()
    const visitTime = new Date(visitDate)
    const diffHours = (visitTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (diffHours < -2) return { status: "completed", color: "secondary" }
    if (diffHours < 0) return { status: "ongoing", color: "default" }
    if (diffHours < 24) return { status: "today", color: "destructive" }
    return { status: "scheduled", color: "outline" }
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleTimeString()
  }

  const { status, color } = getVisitStatus(visit.visitdate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Visit Details</h2>
          <p className="text-muted-foreground">Visit ID: {visit.visitid}</p>
          <Badge variant={color as any} className="mt-2">
            {status}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      {/* Visit Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Visit Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Visit Date</p>
            <p className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(visit.visitdate)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Visit Time</p>
            <p className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(visit.visitdate)}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Purpose</p>
            <p>{visit.purpose || "General visit"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Duty Personnel</p>
            <p className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {visit.dutypersonnel}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Participant Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visitor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Visitor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="font-medium">
                {visit.visitor_lname}, {visit.visitor_fname}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Visitor ID</p>
              <p>{visit.visitorid}</p>
            </div>
          </CardContent>
        </Card>

        {/* Inmate Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Inmate Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="font-medium">
                {visit.inmate_lname}, {visit.inmate_fname}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">PDL ID</p>
              <p>{visit.inmateid}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Record Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Record Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
            <p>{formatDateTime(visit.created_at)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
            <p>{formatDateTime(visit.updated_at)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Visit Status Information */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge variant={color as any} className="text-sm">
              {status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {status === "completed" && "This visit has been completed"}
              {status === "ongoing" && "This visit is currently in progress"}
              {status === "today" && "This visit is scheduled for today"}
              {status === "scheduled" && "This visit is scheduled for a future date"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
