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

interface InmateFormProps {
  inmate?: any
  onSuccess: () => void
  onCancel: () => void
}

export function InmateForm({ inmate, onSuccess, onCancel }: InmateFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mname: "",
    dob: "",
    gender: "",
    nationality: "",
    occupation: "",
    ageduringarrest: "",
    education: "",
    dateofarrest: "",
    arrestingunit: "",
    placeofarrest: "",
    casesfiled: "",
    placecasefiled: "",
    docketnumber: "",
    ccnum_isnum: "",
    prosrtcbranch: "",
    status: "",
    remarks: "",
  })

  useEffect(() => {
    if (inmate) {
      setFormData({
        fname: inmate.fname || "",
        lname: inmate.lname || "",
        mname: inmate.mname || "",
        dob: inmate.dob ? inmate.dob.split("T")[0] : "",
        gender: inmate.gender || "",
        nationality: inmate.nationality || "",
        occupation: inmate.occupation || "",
        ageduringarrest: inmate.ageduringarrest?.toString() || "",
        education: inmate.education || "",
        dateofarrest: inmate.dateofarrest ? new Date(inmate.dateofarrest).toISOString().slice(0, 16) : "",
        arrestingunit: inmate.arrestingunit || "",
        placeofarrest: inmate.placeofarrest || "",
        casesfiled: inmate.casesfiled || "",
        placecasefiled: inmate.placecasefiled || "",
        docketnumber: inmate.docketnumber || "",
        ccnum_isnum: inmate.ccnum_isnum || "",
        prosrtcbranch: inmate.prosrtcbranch || "",
        status: inmate.status || "",
        remarks: inmate.remarks || "",
      })
    }
  }, [inmate])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await apiClient.createPDL({
        ...formData,
        ageduringarrest: Number.parseInt(formData.ageduringarrest) || 0,
      })

      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || "Failed to save inmate")
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
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => handleChange("education", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Arrest Information */}
      <Card>
        <CardHeader>
          <CardTitle>Arrest Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateofarrest">Date of Arrest</Label>
            <Input
              id="dateofarrest"
              type="datetime-local"
              value={formData.dateofarrest}
              onChange={(e) => handleChange("dateofarrest", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ageduringarrest">Age During Arrest</Label>
            <Input
              id="ageduringarrest"
              type="number"
              value={formData.ageduringarrest}
              onChange={(e) => handleChange("ageduringarrest", e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="arrestingunit">Arresting Unit</Label>
            <Input
              id="arrestingunit"
              value={formData.arrestingunit}
              onChange={(e) => handleChange("arrestingunit", e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="placeofarrest">Place of Arrest</Label>
            <Input
              id="placeofarrest"
              value={formData.placeofarrest}
              onChange={(e) => handleChange("placeofarrest", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Case Information */}
      <Card>
        <CardHeader>
          <CardTitle>Case Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="casesfiled">Cases Filed</Label>
            <Textarea
              id="casesfiled"
              value={formData.casesfiled}
              onChange={(e) => handleChange("casesfiled", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placecasefiled">Place Case Filed</Label>
            <Input
              id="placecasefiled"
              value={formData.placecasefiled}
              onChange={(e) => handleChange("placecasefiled", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="docketnumber">Docket Number</Label>
            <Input
              id="docketnumber"
              value={formData.docketnumber}
              onChange={(e) => handleChange("docketnumber", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ccnum_isnum">CC/IS Number</Label>
            <Input
              id="ccnum_isnum"
              value={formData.ccnum_isnum}
              onChange={(e) => handleChange("ccnum_isnum", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prosrtcbranch">Prosecutor/RTC Branch</Label>
            <Input
              id="prosrtcbranch"
              value={formData.prosrtcbranch}
              onChange={(e) => handleChange("prosrtcbranch", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status and Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Remarks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Detained">Detained</SelectItem>
                <SelectItem value="Released">Released</SelectItem>
                <SelectItem value="Transferred">Transferred</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              rows={4}
              placeholder="Additional notes or remarks..."
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
          {inmate ? "Update" : "Save"} Inmate
        </Button>
      </div>
    </form>
  )
}
