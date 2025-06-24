"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Bell, Palette, LogOut, Trash2, Sun, Moon, Monitor } from "lucide-react"
import { PrivateHeader } from "@/components/header"

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    theme: "system" as "light" | "dark" | "system",
  })

  const handleSettingChange = <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSignOut = () => {
    router.push("/signin")
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    // TODO: Replace with proper toast notification
    console.log("Account deletion request submitted")
    router.push("/signin")
  }

  const getThemeIcon = () => {
    switch (settings.theme) {
      case "light":
        return <Sun className="w-4 h-4" />
      case "dark":
        return <Moon className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      <main className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h1 className="text-4xl font-light text-gray-900 mb-2">Settings</h1>
            <p className="text-xl text-gray-600">Manage your preferences</p>
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-medium text-gray-900">
                  <Bell className="w-5 h-5 mr-3 text-gray-600" />
                  Notifications
                </CardTitle>
                <CardDescription>Choose what updates you receive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Get notified about your presentations and account activity</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-medium text-gray-900">
                  <Palette className="w-5 h-5 mr-3 text-gray-600" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize how PresentPro looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="theme" className="font-medium">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleSettingChange("theme", value)}
                  >
                    <SelectTrigger id="theme" className="w-full">
                      <SelectValue>
                        <span className="flex items-center">
                          {getThemeIcon()}
                          <span className="ml-2 capitalize">{settings.theme}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <span className="flex items-center">
                          <Sun className="w-4 h-4 mr-2" />
                          Light
                        </span>
                      </SelectItem>
                      <SelectItem value="dark">
                        <span className="flex items-center">
                          <Moon className="w-4 h-4 mr-2" />
                          Dark
                        </span>
                      </SelectItem>
                      <SelectItem value="system">
                        <span className="flex items-center">
                          <Monitor className="w-4 h-4 mr-2" />
                          System
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-gray-900">Account</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all of your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}