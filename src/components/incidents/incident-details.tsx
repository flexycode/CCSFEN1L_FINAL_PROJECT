"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, AlertTriangle, User, Calendar, FileText, Clock } from "lucide-react"

interface IncidentDetailsProps {
  incident: any
  onClose: () => void
}

export function IncidentDetails({ incident, onClose }: IncidentDetailsProps) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Incident Report</h2>
          <p className="text-muted-foreground">Incident ID: {incident.incidentid}</p>
          <Badge variant={getSeverityColor(incident.natureofincident)} className="mt-2">
            {incident.natureofincident}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      {/* Incident Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Incident Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Incident Date</p>
            <p className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(incident.incidentdate)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Incident Time</p>
            <p className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(incident.incidentdate)}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Nature of Incident</p>
            <Badge variant={getSeverityColor(incident.natureofincident)} className="mt-1">
              {incident.natureofincident}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Involved Inmate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Involved Inmate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="font-medium">
              {incident.inmate_lname}, {incident.inmate_fname}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">PDL ID</p>
            <p>{incident.pdl_id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Incident Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Incident Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{incident.incidentdesc}</p>
          </div>
        </CardContent>
      </Card>

      {/* Record Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Record Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reported</p>
            <p>{formatDateTime(incident.created_at)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
            <p>{formatDateTime(incident.updated_at)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Severity Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Severity Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge variant={getSeverityColor(incident.natureofincident)} className="text-sm">
              {(() => {
                const nature = incident.natureofincident?.toLowerCase() || ""
                if (nature.includes("fight") || nature.includes("violence") || nature.includes("assault")) {
                  return "HIGH SEVERITY"
                }
                if (nature.includes("medical") || nature.includes("emergency")) {
                  return "MEDIUM SEVERITY"
                }
                if (nature.includes("disturbance") || nature.includes("argument")) {
                  return "LOW SEVERITY"
                }
                return "STANDARD"
              })()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {(() => {
                const nature = incident.natureofincident?.toLowerCase() || ""
                if (nature.includes("fight") || nature.includes("violence") || nature.includes("assault")) {
                  return "Requires immediate attention and investigation"
                }
                if (nature.includes("medical") || nature.includes("emergency")) {
                  return "Medical response may be required"
                }
                if (nature.includes("disturbance") || nature.includes("argument")) {
                  return "Monitor situation and document"
                }
                return "Standard incident documentation"
              })()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
