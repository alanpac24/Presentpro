"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Camera, Save, Edit3, Crown, Calendar, Mail, Phone, MapPin, Building, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
import { mockUser as baseUser } from "@/lib/constants"

// Extended user data for profile page
const mockUser = {
  ...baseUser,
  position: "Senior Product Manager",
}

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ ...mockUser })

  const handleSave = () => setIsEditing(false)
  const handleCancel = () => {
    setIsEditing(false)
    setFormData({ ...mockUser })
  }

  const handleLogout = () => {
    router.push("/signin")
  }

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      <main className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-light text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-xl text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardContent className="p-8 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-28 w-28">
                      {mockUser.avatar && <AvatarImage src={mockUser.avatar} alt={mockUser.name} />}
                      <AvatarFallback className="bg-gray-900 text-white text-4xl">JD</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-gray-900 hover:bg-gray-800"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-medium text-gray-900">{formData.name}</h2>
                  <p className="text-gray-600 mb-4">{formData.position}</p>
                  <Badge variant="secondary" className="mb-6">
                    <Crown className="w-3 h-3 mr-1.5" />
                    {mockUser.tier}
                  </Badge>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {mockUser.joinDate}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-medium text-gray-900">Personal Information</CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleCancel} variant="outline">
                          Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {formData.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {formData.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {formData.phone}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                        Location
                      </Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {formData.location}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                        Company
                      </Label>
                      {isEditing ? (
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900">
                          <Building className="w-4 h-4 mr-2 text-gray-400" />
                          {formData.company}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                        Website
                      </Label>
                      {isEditing ? (
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900">
                          <Globe className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={formData.website} className="text-blue-600 hover:underline">
                            {formData.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                      Job Title
                    </Label>
                    {isEditing ? (
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="border-gray-300 focus:border-gray-400"
                      />
                    ) : (
                      <div className="text-gray-900">{formData.position}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                      Bio
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="border-gray-300 focus:border-gray-400"
                      />
                    ) : (
                      <div className="text-gray-700 leading-relaxed">{formData.bio}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}