"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
import { mockUser } from "@/lib/constants"

export default function UpgradePage() {
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)

  const handleUpgrade = (planName: string) => {
    // In a real app, this would initiate the payment flow
    console.log(`Upgrading to ${planName} plan`)
    // For now, just redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      <main className="bg-gray-50">
        <section className="py-32 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                Simple
                <span className="block text-gray-600">Pricing</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light mb-8">
                Choose the perfect plan for your presentation needs. All plans include our AI-powered generation engine.
              </p>
              
              {/* Monthly/Yearly Toggle */}
              <div className="flex items-center justify-center space-x-4">
                <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isYearly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                  Yearly
                  <Badge className="ml-2 bg-green-100 text-green-700 border-0">Save 20%</Badge>
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <Card className={`bg-white border ${mockUser.tier === "Free" ? "border-gray-400" : "border-gray-200"} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative flex flex-col`}>
                {mockUser.tier === "Free" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gray-900 text-white border-0">CURRENT PLAN</Badge>
                  </div>
                )}
                <CardHeader className="p-8 text-center">
                  <CardTitle className="text-gray-900 text-xl font-medium mb-2">Free</CardTitle>
                  <div className="text-4xl font-light text-gray-900 mb-2">$0</div>
                  <div className="text-gray-600 text-sm">per month</div>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      3 presentations/month
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      Basic templates
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      PDF export
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      Email support
                    </li>
                  </ul>
                  <div className="mt-auto">
                    <Button 
                      className="w-full bg-gray-200 text-gray-500 font-medium h-12 text-sm tracking-wide cursor-not-allowed"
                      disabled={mockUser.tier === "Free"}
                    >
                      {mockUser.tier === "Free" ? "CURRENT PLAN" : "DOWNGRADE TO FREE"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className={`bg-white ${mockUser.tier === "Pro" ? "border-gray-400" : "border-2 border-blue-600"} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative transform scale-105 flex flex-col`}>
                {mockUser.tier === "Pro" ? (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gray-900 text-white border-0 px-4 py-1">CURRENT PLAN</Badge>
                  </div>
                ) : (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white font-medium border-0 px-4 py-1">MOST POPULAR</Badge>
                  </div>
                )}
                <CardHeader className="p-8 text-center">
                  <CardTitle className="text-gray-900 text-xl font-medium mb-2">Pro</CardTitle>
                  <div className="text-4xl font-light text-gray-900 mb-2">
                    ${isYearly ? Math.round(29 * 0.8) : 29}
                  </div>
                  <div className="text-gray-600 text-sm">
                    per month {isYearly && <span className="text-green-600">(billed yearly)</span>}
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      10 presentations/month
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      Basic templates library
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      PDF & PowerPoint export
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      Email support
                    </li>
                  </ul>
                  <div className="mt-auto">
                    <Button 
                      className={`w-full ${mockUser.tier === "Pro" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"} font-medium h-12 text-sm tracking-wide btn-enhanced`}
                      disabled={mockUser.tier === "Pro"}
                      onClick={() => mockUser.tier !== "Pro" && handleUpgrade("Pro")}
                    >
                      {mockUser.tier === "Pro" ? "CURRENT PLAN" : "UPGRADE TO PRO"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Plan */}
              <Card className={`bg-white border ${mockUser.tier === "Professional" ? "border-gray-400" : "border-gray-200"} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative flex flex-col`}>
                {mockUser.tier === "Professional" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gray-900 text-white border-0">CURRENT PLAN</Badge>
                  </div>
                )}
                <CardHeader className="p-8 text-center">
                  <CardTitle className="text-gray-900 text-xl font-medium mb-2">Professional</CardTitle>
                  <div className="text-4xl font-light text-gray-900 mb-2">
                    ${isYearly ? Math.round(79 * 0.8) : 79}
                  </div>
                  <div className="text-gray-600 text-sm">
                    per month {isYearly && <span className="text-green-600">(billed yearly)</span>}
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      50 presentations/month
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      Premium templates (500+)
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      PDF & PowerPoint export
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      AI chat assistance
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      Custom branding
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                      Priority support
                    </li>
                  </ul>
                  <div className="mt-auto">
                    <Button 
                      className={`w-full ${mockUser.tier === "Professional" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-900 hover:bg-blue-600 text-white"} font-medium h-12 text-sm tracking-wide btn-enhanced`}
                      disabled={mockUser.tier === "Professional"}
                      onClick={() => mockUser.tier !== "Professional" && handleUpgrade("Professional")}
                    >
                      {mockUser.tier === "Professional" ? "CURRENT PLAN" : "GO PROFESSIONAL"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enterprise CTA */}
            <div className="text-center mt-16">
              <p className="text-gray-600 mb-4">
                Need more? Looking for enterprise features, custom contracts, or dedicated support?
              </p>
              <Button 
                variant="outline" 
                className="border-gray-300 hover:bg-gray-50"
                onClick={() => router.push("/contact")}
              >
                Contact Sales for Enterprise Plans
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}