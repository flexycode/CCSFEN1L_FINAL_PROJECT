"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, User, FileText, Calendar, MapPin } from "lucide-react"

interface InmateDetailsProps {
  inmate: any
  onClose: () => void
}

export function InmateDetails({ inmate, onClose }: InmateDetailsProps) {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">
            {inmate.lname}, {inmate.fname} {inmate.mname}
          </h2>
          <p className="text-muted-foreground">PDL ID: {inmate.pdl_id}</p>
          <Badge variant={getStatusColor(inmate.status)} className="mt-2">
            {inmate.status}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
            <p>{formatDate(inmate.dob)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Gender</p>
            <p>{inmate.gender === "M" ? "Male" : "Female"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nationality</p>
            <p>{inmate.nationality || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Occupation</p>
            <p>{inmate.occupation || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Education</p>
            <p>{inmate.education || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Age During Arrest</p>
            <p>{inmate.ageduringarrest || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Arrest Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Arrest Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Arrest</p>
              <p>{formatDateTime(inmate.dateofarrest)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Place of Arrest</p>
              <p>{inmate.placeofarrest || "N/A"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Arresting Unit</p>
            <p>{inmate.arrestingunit || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Case Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Case Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cases Filed</p>
            <p className="whitespace-pre-wrap">{inmate.casesfiled || "N/A"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Place Case Filed</p>
              <p>{inmate.placecasefiled || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Docket Number</p>
              <p>{inmate.docketnumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CC/IS Number</p>
              <p>{inmate.ccnum_isnum || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Prosecutor/RTC Branch</p>
              <p>{inmate.prosrtcbranch || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remarks */}
      {inmate.remarks && (
        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{inmate.remarks}</p>
          </CardContent>
        </Card>
      )}

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
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p>{formatDateTime(inmate.created_at)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
            <p>{formatDateTime(inmate.updated_at)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
