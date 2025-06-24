"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Zap, Users, Palette, BarChart3, Cloud, Headphones, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
import { mockUser } from "@/lib/constants"

const plans = [
  {
    name: "Free",
    basePrice: 0,
    period: "per month",
    description: "For getting started",
    current: mockUser.tier === "Free",
    popular: false,
    features: [
      { name: "3 presentations/month", included: true },
      { name: "Basic templates", included: true },
      { name: "PDF export", included: true },
      { name: "Email support", included: true },
      { name: "PowerPoint export", included: false },
      { name: "Premium templates", included: false },
      { name: "AI chat assistance", included: false },
      { name: "Custom branding", included: false },
    ],
  },
  {
    name: "Pro",
    basePrice: 29,
    period: "per month",
    description: "For regular users",
    current: mockUser.tier === "Pro",
    popular: true,
    features: [
      { name: "10 presentations/month", included: true },
      { name: "Basic templates", included: true },
      { name: "PDF & PowerPoint export", included: true },
      { name: "Email support", included: true },
      { name: "Premium templates", included: false },
      { name: "AI chat assistance", included: false },
      { name: "Custom branding", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    name: "Professional",
    basePrice: 79,
    period: "per month",
    description: "For power users",
    current: mockUser.tier === "Professional",
    popular: false,
    features: [
      { name: "50 presentations/month", included: true },
      { name: "Premium templates (500+)", included: true },
      { name: "PDF & PowerPoint export", included: true },
      { name: "Priority support", included: true },
      { name: "AI chat assistance", included: true },
      { name: "Custom branding", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Early access features", included: true },
    ],
  },
  {
    name: "Enterprise",
    basePrice: 49,
    period: "per user / month",
    description: "For large teams",
    current: false,
    popular: false,
    features: [
      { name: "Unlimited presentations", included: true },
      { name: "Custom templates", included: true },
      { name: "All export formats", included: true },
      { name: "24/7 phone support", included: true },
      { name: "Advanced AI features", included: true },
      { name: "Full custom branding", included: true },
      { name: "Team collaboration", included: true },
      { name: "Priority support", included: true },
    ],
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    content: "PresentPro has transformed how we create presentations. The AI assistance is incredible!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Sales Manager",
    company: "GrowthCo",
    content: "Our conversion rates improved by 40% after switching to PresentPro's professional templates.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Consultant",
    company: "Strategy Plus",
    content: "The time I save with PresentPro allows me to focus on what matters most - my clients.",
    rating: 5,
  },
]

export default function UpgradePage() {
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)

  const handleLogout = () => {
    router.push("/signin")
  }

  const handleUpgrade = (planName: string) => {
    // In a real app, this would initiate the payment flow
    router.push(`/checkout?plan=${planName.toLowerCase()}`)
    // Here you would handle the upgrade process
  }

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      <main className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-gray-900 mb-4">Upgrade Your Plan</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock the full power of PresentPro with advanced features that make every slide stunning.
            </p>
          </div>

          <div className="flex items-center justify-center mb-12">
            <div className="bg-gray-100 p-1 rounded-full inline-flex">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
                  !isYearly 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
                  isYearly 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly <span className="text-green-600 ml-1">Save 20%</span>
              </button>
            </div>
          </div>

          {isYearly && (
            <p className="text-center text-gray-600 mb-8">
              All plans are billed yearly with a 20% discount
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col ${plan.popular ? "ring-2 ring-gray-900" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-medium text-gray-900 mb-2">{plan.name}</CardTitle>
                  <p className="text-gray-600">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-light text-gray-900">
                      ${isYearly && plan.basePrice > 0 ? Math.round(plan.basePrice * 0.8) : plan.basePrice}
                    </span>
                    <span className="text-gray-600">
                      {plan.name === "Free" ? " per month" : isYearly ? "/month" : " per month"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mr-3" />
                        )}
                        <span className={feature.included ? "text-gray-700" : "text-gray-400"}>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    disabled={plan.current}
                    className={`w-full h-12 ${plan.current ? "bg-gray-200 text-gray-500" : plan.popular ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"}`}
                  >
                    {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Why Choose PresentPro?</h2>
              <p className="text-lg text-gray-600">Everything you need to create stunning presentations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white border border-gray-100 shadow-sm text-center">
                <CardContent className="p-8">
                  <Zap className="w-12 h-12 text-gray-900 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">AI-Powered Creation</h3>
                  <p className="text-gray-600">
                    Generate professional presentations in minutes with our advanced AI technology
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm text-center">
                <CardContent className="p-8">
                  <Palette className="w-12 h-12 text-gray-900 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Premium Templates</h3>
                  <p className="text-gray-600">
                    Access hundreds of professionally designed templates for every industry
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm text-center">
                <CardContent className="p-8">
                  <Users className="w-12 h-12 text-gray-900 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Team Collaboration</h3>
                  <p className="text-gray-600">Work together seamlessly with real-time editing and commenting</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm text-center">
                <CardContent className="p-8">
                  <BarChart3 className="w-12 h-12 text-gray-900 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Analytics Dashboard</h3>
                  <p className="text-gray-600">Track engagement and performance with detailed presentation analytics</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm text-center">
                <CardContent className="p-8">
                  <Cloud className="w-12 h-12 text-gray-900 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Cloud Storage</h3>
                  <p className="text-gray-600">Access your presentations anywhere with secure cloud storage</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-100 shadow-sm text-center">
                <CardContent className="p-8">
                  <Headphones className="w-12 h-12 text-gray-900 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Priority Support</h3>
                  <p className="text-gray-600">Get help when you need it with our dedicated support team</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Loved by Professionals</h2>
              <p className="text-lg text-gray-600">See what our customers are saying</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white border border-gray-100 shadow-sm">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gray-50 border border-gray-100 shadow-sm">
              <CardContent className="p-12">
                <h2 className="text-3xl font-light text-gray-900 mb-4">Ready to Get Started?</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Join thousands of professionals who trust PresentPro to create amazing presentations
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={() => handleUpgrade("Professional")}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg"
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="border-gray-300 hover:bg-gray-50 px-8 py-3 text-lg"
                  >
                    Continue with Free
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}