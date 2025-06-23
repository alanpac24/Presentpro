"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Presentation, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { MinimalHeader } from "@/components/minimal-header"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MinimalHeader />
        <div className="flex items-center justify-center px-6 min-h-[calc(100vh-5rem)]">
          <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-lg">
          <CardContent className="p-10 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-light text-gray-900 mb-3">Check your email</h2>
            <p className="text-lg text-gray-600 font-light mb-6">
              We've sent a password reset link to <strong className="font-medium text-gray-800">{email}</strong>.
            </p>
            <p className="text-sm text-gray-500 mb-8">Didn't receive it? Check spam or try another email.</p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
                variant="outline"
                className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium tracking-wide rounded-md"
              >
                Try different email
              </Button>
              <Link href="/signin">
                <Button className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium tracking-wide rounded-md">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MinimalHeader />
      <div className="flex items-center justify-center px-6 min-h-[calc(100vh-5rem)]">
        <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-lg">
        <CardHeader className="text-center p-8 pb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-2xl font-light text-gray-900 tracking-wide">PRESENTPRO</span>
          </div>
          <CardTitle className="text-3xl font-light text-gray-900">Reset your password</CardTitle>
          <CardDescription className="text-lg text-gray-600 font-light pt-2">
            Enter your email to receive a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
                <XCircle className="h-4 w-4 text-red-700" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError("")
                }}
                className={`h-12 text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg ${error ? "border-red-500" : ""}`}
                placeholder="john.doe@company.com"
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium tracking-wide rounded-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Link...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/signin"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}