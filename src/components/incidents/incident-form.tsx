"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"
import { Loader2, Save, X, Search } from "lucide-react"

interface IncidentFormProps {
  incident?: any
  onSuccess: () => void
  onCancel: () => void
}

export function IncidentForm({ incident, onSuccess, onCancel }: IncidentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    pdl_id: "",
    incidentdate: "",
    natureofincident: "",
    incidentdesc: "",
  })

  // For inmate search
  const [inmateSearch, setInmateSearch] = useState("")
  const [inmates, setInmates] = useState<any[]>([])

  useEffect(() => {
    if (incident) {
      setFormData({
        pdl_id: incident.pdl_id || "",
        incidentdate: incident.incidentdate ? new Date(incident.incidentdate).toISOString().slice(0, 16) : "",
        natureofincident: incident.natureofincident || "",
        incidentdesc: incident.incidentdesc || "",
      })
    } else {
      // Set default incident date to current time
      const now = new Date()
      setFormData((prev) => ({
        ...prev,
        incidentdate: now.toISOString().slice(0, 16),
      }))
    }
  }, [incident])

  // Search for inmates
  useEffect(() => {
    if (inmateSearch.length > 2) {
      searchInmates()
    }
  }, [inmateSearch])

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.pdl_id) {
      setError("Please select an inmate involved in the incident")
      setLoading(false)
      return
    }

    try {
      const response = await apiClient.createIncident(formData)

      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || "Failed to report incident")
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

      {/* Incident Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Inmate Selection */}
          <div className="space-y-2">
            <Label htmlFor="inmate-search">Involved Inmate *</Label>
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
                      handleChange("pdl_id", inmate.pdl_id)
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
            {formData.pdl_id && <p className="text-sm text-green-600">Selected Inmate ID: {formData.pdl_id}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incidentdate">Incident Date & Time *</Label>
              <Input
                id="incidentdate"
                type="datetime-local"
                value={formData.incidentdate}
                onChange={(e) => handleChange("incidentdate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="natureofincident">Nature of Incident *</Label>
              <Select
                value={formData.natureofincident}
                onValueChange={(value) => handleChange("natureofincident", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fight">Fight</SelectItem>
                  <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                  <SelectItem value="Disturbance">Disturbance</SelectItem>
                  <SelectItem value="Violence">Violence</SelectItem>
                  <SelectItem value="Assault">Assault</SelectItem>
                  <SelectItem value="Self-Harm">Self-Harm</SelectItem>
                  <SelectItem value="Contraband">Contraband</SelectItem>
                  <SelectItem value="Escape Attempt">Escape Attempt</SelectItem>
                  <SelectItem value="Property Damage">Property Damage</SelectItem>
                  <SelectItem value="Verbal Altercation">Verbal Altercation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Description */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="incidentdesc">Detailed Description *</Label>
            <Textarea
              id="incidentdesc"
              value={formData.incidentdesc}
              onChange={(e) => handleChange("incidentdesc", e.target.value)}
              rows={8}
              placeholder="Provide a detailed description of the incident including:
- What happened?
- When did it occur?
- Where did it take place?
- Who was involved?
- What actions were taken?
- Any injuries or damages?
- Witnesses present?"
              required
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Be as detailed and objective as possible. Include all relevant facts and circumstances.
          </p>
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
          {incident ? "Update" : "Report"} Incident
        </Button>
      </div>
    </form>
  )
}
