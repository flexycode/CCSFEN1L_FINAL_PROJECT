"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, User, Heart, Phone, Calendar } from "lucide-react"

interface VisitorDetailsProps {
  visitor: any
  onClose: () => void
}

export function VisitorDetails({ visitor, onClose }: VisitorDetailsProps) {
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
            {visitor.lname}, {visitor.fname} {visitor.mname}
          </h2>
          <p className="text-muted-foreground">Visitor ID: {visitor.visitorid}</p>
          <Badge variant={getRelationshipColor(visitor.relationship)} className="mt-2">
            {visitor.relationship}
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
            <p>{formatDate(visitor.dob)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Gender</p>
            <p>{visitor.gender === "M" ? "Male" : "Female"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nationality</p>
            <p>{visitor.nationality || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Occupation</p>
            <p>{visitor.occupation || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
            <p className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {visitor.contactnum || "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Relationship Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Relationship Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Relationship to PDL</p>
              <Badge variant={getRelationshipColor(visitor.relationship)}>{visitor.relationship}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">PDL to Visit</p>
              <p>{visitor.pdltovisit || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remarks */}
      {visitor.remarks && (
        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{visitor.remarks}</p>
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
            <p className="text-sm font-medium text-muted-foreground">Registered</p>
            <p>{formatDateTime(visitor.created_at)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
            <p>{formatDateTime(visitor.updated_at)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
