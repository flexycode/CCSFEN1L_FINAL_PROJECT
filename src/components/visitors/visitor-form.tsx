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
import { Loader2, Save, X } from "lucide-react"

interface VisitorFormProps {
  visitor?: any
  onSuccess: () => void
  onCancel: () => void
}

export function VisitorForm({ visitor, onSuccess, onCancel }: VisitorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mname: "",
    relationship: "",
    dob: "",
    gender: "",
    nationality: "",
    occupation: "",
    pdltovisit: "",
    contactnum: "",
    remarks: "",
  })

  useEffect(() => {
    if (visitor) {
      setFormData({
        fname: visitor.fname || "",
        lname: visitor.lname || "",
        mname: visitor.mname || "",
        relationship: visitor.relationship || "",
        dob: visitor.dob ? visitor.dob.split("T")[0] : "",
        gender: visitor.gender || "",
        nationality: visitor.nationality || "",
        occupation: visitor.occupation || "",
        pdltovisit: visitor.pdltovisit || "",
        contactnum: visitor.contactnum || "",
        remarks: visitor.remarks || "",
      })
    }
  }, [visitor])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await apiClient.createVisitor(formData)

      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || "Failed to save visitor")
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

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fname">First Name *</Label>
            <Input id="fname" value={formData.fname} onChange={(e) => handleChange("fname", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lname">Last Name *</Label>
            <Input id="lname" value={formData.lname} onChange={(e) => handleChange("lname", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mname">Middle Name</Label>
            <Input id="mname" value={formData.mname} onChange={(e) => handleChange("mname", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => handleChange("nationality", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => handleChange("occupation", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactnum">Contact Number</Label>
            <Input
              id="contactnum"
              value={formData.contactnum}
              onChange={(e) => handleChange("contactnum", e.target.value)}
              placeholder="+63 XXX XXX XXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* Relationship Information */}
      <Card>
        <CardHeader>
          <CardTitle>Relationship & Visit Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship to PDL *</Label>
              <Select value={formData.relationship} onValueChange={(value) => handleChange("relationship", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Relative">Relative</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Lawyer">Lawyer</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdltovisit">PDL to Visit *</Label>
              <Input
                id="pdltovisit"
                value={formData.pdltovisit}
                onChange={(e) => handleChange("pdltovisit", e.target.value)}
                placeholder="Enter PDL name or ID"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              rows={4}
              placeholder="Additional notes, special requirements, or other relevant information..."
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
          {visitor ? "Update" : "Save"} Visitor
        </Button>
      </div>
    </form>
  )
}
