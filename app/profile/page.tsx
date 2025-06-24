"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Save, Edit3, Crown, Mail, Lock } from "lucide-react"
import { PrivateHeader } from "@/components/header"
import { mockUser } from "@/lib/constants"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ ...mockUser })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleSave = () => {
    // Update initials based on new name
    const newInitials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()
    setFormData({ ...formData, initials: newInitials })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({ ...mockUser })
  }

  const handlePasswordChange = () => {
    // Here you would handle the password change logic
    setIsChangingPassword(false)
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      <main className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-light text-gray-900 mb-2">Profile</h1>
            <p className="text-xl text-gray-600">Manage your account information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardContent className="p-8 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-32 w-32">
                      {formData.avatar && <AvatarImage src={formData.avatar} alt={`${formData.firstName} ${formData.lastName}`} />}
                      <AvatarFallback className="bg-gray-900 text-white text-4xl">{formData.initials}</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-gray-900 hover:bg-gray-800"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-medium text-gray-900 mb-1">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">{formData.email}</p>
                  <Badge variant="secondary">
                    <Crown className="w-3 h-3 mr-1.5" />
                    {formData.tier} Plan
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-medium text-gray-900">Personal Information</CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleCancel} variant="outline">
                          Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      ) : (
                        <div className="text-gray-900 py-2">{formData.firstName}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      ) : (
                        <div className="text-gray-900 py-2">{formData.lastName}</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="flex items-center text-gray-900 py-2">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {formData.email}
                    </div>
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                </CardContent>
              </Card>

              {/* Change Password Card */}
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-medium text-gray-900">Password</CardTitle>
                    {!isChangingPassword && (
                      <Button onClick={() => setIsChangingPassword(true)} variant="outline">
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isChangingPassword ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="border-gray-300 focus:border-gray-400"
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button onClick={() => setIsChangingPassword(false)} variant="outline">
                          Cancel
                        </Button>
                        <Button onClick={handlePasswordChange} className="bg-gray-900 hover:bg-gray-800">
                          Update Password
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">Use a strong password to keep your account secure</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}