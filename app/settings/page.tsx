"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Bell, Shield, Palette, Download, Trash2, Key, Moon, Sun, Monitor, Save } from "lucide-react"
import { PrivateHeader } from "@/components/header"
import { mockUser } from "@/lib/constants"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    profileVisibility: "public",
    dataSharing: false,
    theme: "system",
  })

  const handleSettingChange = (key: string, value: any) => setSettings((prev) => ({ ...prev, [key]: value }))
  const handleSave = () => {
    // In a real app, this would save to an API
    alert("Settings saved successfully!")
  }
  const handleLogout = () => {
    // Redirect to login page
  }
  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    alert("Account deletion request submitted. You will receive a confirmation email.")
    // Handle account deletion
  }

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      <main className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h1 className="text-4xl font-light text-gray-900 mb-2">Settings</h1>
            <p className="text-lg text-gray-600">Customize your PresentPro experience.</p>
          </div>

          <div className="space-y-8">
            <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-medium text-gray-900">
                  <Bell className="w-5 h-5 mr-3 text-gray-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 divide-y divide-gray-200">
                <div className="flex items-center justify-between pt-4 first:pt-0">
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive updates about your presentations.</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(c) => handleSettingChange("emailNotifications", c)}
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <Label className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Get notified in your browser.</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(c) => handleSettingChange("pushNotifications", c)}
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <Label className="font-medium">Weekly Digest</Label>
                    <p className="text-sm text-gray-600">Receive a weekly summary of your activity.</p>
                  </div>
                  <Switch
                    checked={settings.weeklyDigest}
                    onCheckedChange={(c) => handleSettingChange("weeklyDigest", c)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-medium text-gray-900">
                  <Shield className="w-5 h-5 mr-3 text-gray-600" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 divide-y divide-gray-200">
                <div className="flex items-center justify-between pt-4 first:pt-0">
                  <div>
                    <Label className="font-medium">Profile Visibility</Label>
                    <p className="text-sm text-gray-600">Control who can see your profile.</p>
                  </div>
                  <Select
                    value={settings.profileVisibility}
                    onValueChange={(v) => handleSettingChange("profileVisibility", v)}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <Label className="font-medium">Data Sharing</Label>
                    <p className="text-sm text-gray-600">Allow anonymized usage data sharing.</p>
                  </div>
                  <Switch
                    checked={settings.dataSharing}
                    onCheckedChange={(c) => handleSettingChange("dataSharing", c)}
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <Label className="font-medium">Change Password</Label>
                    <p className="text-sm text-gray-600">Update your account password.</p>
                  </div>
                  <Button variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-medium text-gray-900">
                  <Palette className="w-5 h-5 mr-3 text-gray-600" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Theme</Label>
                    <p className="text-sm text-gray-600">Choose your preferred color scheme.</p>
                  </div>
                  <Select value={settings.theme} onValueChange={(v) => handleSettingChange("theme", v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="w-4 h-4 mr-2" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="w-4 h-4 mr-2" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center">
                          <Monitor className="w-4 h-4 mr-2" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-red-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-medium text-red-600">
                  <Trash2 className="w-5 h-5 mr-3" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 divide-y divide-red-200">
                <div className="flex items-center justify-between pt-4 first:pt-0">
                  <div>
                    <Label className="font-medium">Export Data</Label>
                    <p className="text-sm text-gray-600">Download all your presentations and data.</p>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <Label className="font-medium text-red-600">Delete Account</Label>
                    <p className="text-sm text-gray-600">Permanently delete your account and all data.</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} size="lg" className="h-12 bg-gray-900 hover:bg-gray-800">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}