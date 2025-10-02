"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"
import { Loader2, Save, X, Search } from "lucide-react"

interface VisitFormProps {
  visit?: any
  onSuccess: () => void
  onCancel: () => void
}

export function VisitForm({ visit, onSuccess, onCancel }: VisitFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    inmateid: "",
    visitorid: "",
    visitdate: "",
    purpose: "",
    dutypersonnel: "",
  })

  // For search suggestions
  const [inmateSearch, setInmateSearch] = useState("")
  const [visitorSearch, setVisitorSearch] = useState("")
  const [inmates, setInmates] = useState<any[]>([])
  const [visitors, setVisitors] = useState<any[]>([])

  useEffect(() => {
    if (visit) {
      setFormData({
        inmateid: visit.inmateid || "",
        visitorid: visit.visitorid || "",
        visitdate: visit.visitdate ? new Date(visit.visitdate).toISOString().slice(0, 16) : "",
        purpose: visit.purpose || "",
        dutypersonnel: visit.dutypersonnel || "",
      })
    } else {
      // Set default visit date to next hour
      const nextHour = new Date()
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0)
      setFormData((prev) => ({
        ...prev,
        visitdate: nextHour.toISOString().slice(0, 16),
      }))
    }
  }, [visit])

  // Search for inmates
  useEffect(() => {
    if (inmateSearch.length > 2) {
      searchInmates()
    }
  }, [inmateSearch])

  // Search for visitors
  useEffect(() => {
    if (visitorSearch.length > 2) {
      searchVisitors()
    }
  }, [visitorSearch])

  const searchInmates = async () => {
    try {
      const response = await apiClient.getPDL({ search: inmateSearch, limit: 5 })
      if (response.success) {
        setInmates(response.data || [])
      }
    } catch (error) {
      console.error("Failed to search inmates:", error)
    }
  }

  const searchVisitors = async () => {
    try {
      const response = await apiClient.getVisitors({ search: visitorSearch, limit: 5 })
      if (response.success) {
        setVisitors(response.data || [])
      }
    } catch (error) {
      console.error("Failed to search visitors:", error)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.inmateid || !formData.visitorid) {
      setError("Please select both an inmate and a visitor")
      setLoading(false)
      return
    }

    try {
      const response = await apiClient.createVisit(formData)

      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || "Failed to schedule visit")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Participant Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Participants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Inmate Selection */}
          <div className="space-y-2">
            <Label htmlFor="inmate-search">Select Inmate *</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="inmate-search"
                placeholder="Search inmate by name or ID..."
                value={inmateSearch}
                onChange={(e) => setInmateSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            {inmates.length > 0 && (
              <div className="border rounded-md max-h-32 overflow-y-auto">
                {inmates.map((inmate) => (
                  <div
                    key={inmate.pdl_id}
                    className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      handleChange("inmateid", inmate.pdl_id)
                      setInmateSearch(`${inmate.lname}, ${inmate.fname} (${inmate.pdl_id})`)
                      setInmates([])
                    }}
                  >
                    <p className="font-medium">
                      {inmate.lname}, {inmate.fname} {inmate.mname}
                    </p>
                    <p className="text-sm text-muted-foreground">ID: {inmate.pdl_id}</p>
                  </div>
                ))}
              </div>
            )}
            {formData.inmateid && <p className="text-sm text-green-600">Selected Inmate ID: {formData.inmateid}</p>}
          </div>

          {/* Visitor Selection */}
          <div className="space-y-2">
            <Label htmlFor="visitor-search">Select Visitor *</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="visitor-search"
                placeholder="Search visitor by name or ID..."
                value={visitorSearch}
                onChange={(e) => setVisitorSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            {visitors.length > 0 && (
              <div className="border rounded-md max-h-32 overflow-y-auto">
                {visitors.map((visitor) => (
                  <div
                    key={visitor.visitorid}
                    className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      handleChange("visitorid", visitor.visitorid)
                      setVisitorSearch(`${visitor.lname}, ${visitor.fname} (${visitor.visitorid})`)
                      setVisitors([])
                    }}
                  >
                    <p className="font-medium">
                      {visitor.lname}, {visitor.fname} {visitor.mname}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {visitor.visitorid} | {visitor.relationship}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {formData.visitorid && <p className="text-sm text-green-600">Selected Visitor ID: {formData.visitorid}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Visit Details */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitdate">Visit Date & Time *</Label>
            <Input
              id="visitdate"
              type="datetime-local"
              value={formData.visitdate}
              onChange={(e) => handleChange("visitdate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              placeholder="Family visit, legal consultation, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dutypersonnel">Duty Personnel *</Label>
            <Input
              id="dutypersonnel"
              value={formData.dutypersonnel}
              onChange={(e) => handleChange("dutypersonnel", e.target.value)}
              placeholder="Officer name or ID"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {visit ? "Update" : "Schedule"} Visit
        </Button>
      </div>
    </form>
  )
}
