"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Presentation, Shield, Phone, ArrowRight, BarChart3, Zap, FileText, Target, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PresentationProAI() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Set smooth scrolling behavior
    document.documentElement.style.scrollBehavior = "smooth"

    // Add click handlers for navigation links
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.hash) {
        e.preventDefault()
        const element = document.querySelector(target.hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }

    const navLinks = document.querySelectorAll('nav a[href^="#"]')
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavClick)
    })

    return () => {
      document.documentElement.style.scrollBehavior = "auto"
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleNavClick)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Presentation className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-light text-gray-900 tracking-wide">PRESENTPRO</div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
              <a
                href="#intelligent-generation"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("intelligent-generation")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium tracking-wide"
              >
                FEATURES
              </a>
              <a
                href="#templates"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium tracking-wide"
              >
                TEMPLATES
              </a>
              <a
                href="#testimonials"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium tracking-wide"
              >
                TESTIMONIALS
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium tracking-wide"
              >
                PRICING
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/signin" className="hidden sm:block">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900 text-sm font-medium tracking-wide">
                  SIGN IN
                </Button>
              </Link>
              <Link href="/signup" className="hidden sm:block">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium tracking-wide px-6 sm:px-8 h-10 sm:h-11 btn-scale">
                  START FREE TRIAL
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="px-4 py-6 space-y-3">
              <a
                href="#intelligent-generation"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("intelligent-generation")?.scrollIntoView({ behavior: "smooth" })
                  setMobileMenuOpen(false)
                }}
                className="block py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                FEATURES
              </a>
              <a
                href="#templates"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" })
                  setMobileMenuOpen(false)
                }}
                className="block py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                TEMPLATES
              </a>
              <a
                href="#testimonials"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" })
                  setMobileMenuOpen(false)
                }}
                className="block py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                TESTIMONIALS
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                  setMobileMenuOpen(false)
                }}
                className="block py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                PRICING
              </a>
              <div className="pt-4 space-y-3">
                <Link href="/signin" className="block">
                  <Button variant="outline" className="w-full">
                    SIGN IN
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800">
                    START FREE TRIAL
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 text-xs font-medium tracking-wide uppercase mb-12">
              AI-Powered Presentation Generation Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight leading-[0.9]">
              Create executive-level
              <span className="block font-normal">presentations</span>
              <span className="block text-gray-600">with professional precision.</span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-10 sm:mb-12 lg:mb-16 max-w-3xl leading-relaxed font-light">
              Deliver compelling presentations that drive results with AI-powered, enterprise-grade PowerPoint decks
              tailored to your business objectives. Start creating professional presentations now.
            </p>

            {/* Search Interface */}
            <div className="max-w-5xl mx-auto mb-16 lg:mb-20">
              <div className="relative">
                <Input
                  placeholder="Create a quarterly business review presentation for board of directors, 25 slides, modern design"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-16 pl-8 pr-48 text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
                />
                <Link href="/signup">
                  <Button className="absolute right-3 top-3 h-10 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-8">
                    GENERATE NOW
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-1 sm:mb-2">2.3M+</div>
                <div className="text-gray-600 text-xs sm:text-sm font-medium tracking-wide uppercase">
                  Presentations Created
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">500+</div>
                <div className="text-gray-600 text-xs lg:text-sm font-medium tracking-wide uppercase">
                  Enterprise Clients
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">15 sec</div>
                <div className="text-gray-600 text-xs lg:text-sm font-medium tracking-wide uppercase">
                  Average Generation Time
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">99.2%</div>
                <div className="text-gray-600 text-xs lg:text-sm font-medium tracking-wide uppercase">
                  Client Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="intelligent-generation" className="py-24 lg:py-32 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-5xl lg:text-6xl font-light text-gray-900 mb-8 tracking-tight leading-tight">
                Intelligent
                <span className="block text-gray-600">Generation</span>
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed font-light">
                Our advanced AI analyzes your business requirements and generates professional-grade presentations with
                executive-level design standards and compelling narratives that drive results.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Zap className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Lightning-Fast Creation</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Generate complete executive presentations in under 30 seconds with our optimized AI engine and
                      professional templates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Shield className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Enterprise Security</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Bank-grade encryption and compliance protocols ensure complete confidentiality of your business
                      data and presentations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Target className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Business-Focused Content</h3>
                    <p className="text-gray-600 leading-relaxed">
                      AI-powered content generation tailored to your industry, audience, and specific business
                      objectives for maximum impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 shadow-sm">
              <div className="space-y-8">
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-900 font-medium">Average Slides Generated</span>
                    <span className="text-2xl font-light text-gray-900">24</span>
                  </div>
                  <div className="text-sm text-gray-600">Per presentation request</div>
                </div>

                <div className="border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-900 font-medium">Processing Speed</span>
                    <span className="text-2xl font-light text-gray-900">15 sec</span>
                  </div>
                  <div className="text-sm text-gray-600">Complete presentation generation</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-900 font-medium">Template Library</span>
                    <span className="text-2xl font-light text-gray-900">500+</span>
                  </div>
                  <div className="text-sm text-gray-600">Professional design templates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section id="templates" className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Professional
              <span className="block text-gray-600">Templates</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl font-light">
              Choose from hundreds of executive-grade presentation templates designed for maximum business impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Business Review Template */}
            <Card className="bg-white border border-gray-200 shadow-sm card-hover overflow-hidden group">
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Business review presentation template"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white text-gray-900 font-medium border-0 shadow-sm">
                    <BarChart3 className="w-3 h-3 mr-1 text-blue-600" />
                    QUARTERLY REVIEW
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-gray-900 text-xl font-medium mb-3">Executive Business Review</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Comprehensive quarterly review template with financial metrics, KPI dashboards, and strategic
                  insights. Perfect for board presentations.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="font-medium">25 Slides</span>
                  </div>
                  <div className="text-gray-900 font-medium">Most Popular</div>
                </div>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium h-12 text-sm tracking-wide">
                    USE TEMPLATE
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Sales Pitch Template */}
            <Card className="bg-white border border-gray-200 shadow-sm card-hover overflow-hidden group">
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Sales pitch presentation template"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white text-gray-900 font-medium border-0 shadow-sm">SALES PITCH</Badge>
                </div>
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-gray-900 text-xl font-medium mb-3">Enterprise Sales Deck</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  High-converting sales presentation with value propositions, case studies, and compelling CTAs.
                  Designed for enterprise deals.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="font-medium">18 Slides</span>
                  </div>
                  <div className="text-gray-900 font-medium">High Converting</div>
                </div>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium h-12 text-sm tracking-wide">
                    USE TEMPLATE
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Strategy Template */}
            <Card className="bg-white border border-gray-200 shadow-sm card-hover overflow-hidden group">
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Strategy presentation template"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white text-gray-900 font-medium border-0 shadow-sm">STRATEGY</Badge>
                </div>
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-gray-900 text-xl font-medium mb-3">Strategic Planning</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Comprehensive strategy template with market analysis, competitive landscape, and roadmap
                  visualization. Ideal for leadership meetings.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="font-medium">32 Slides</span>
                  </div>
                  <div className="text-gray-900 font-medium">Comprehensive</div>
                </div>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium h-12 text-sm tracking-wide">
                    USE TEMPLATE
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section id="testimonials" className="py-32 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Executive
              <span className="block text-gray-600">Success Stories</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <Card className="bg-white border-0 shadow-sm p-10">
              <CardContent className="p-0">
                <div className="flex items-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gray-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-10 text-lg leading-relaxed font-light">
                  "PresentPro transformed our quarterly reviews. What used to take our team 3 days now takes 30 minutes,
                  and the quality is consistently exceptional."
                </p>
                <div className="flex items-center">
                  <Avatar className="mr-4 w-14 h-14">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-gray-900 font-medium">Michael Johnson</div>
                    <div className="text-gray-600 text-sm">VP of Strategy, Microsoft</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm p-10">
              <CardContent className="p-0">
                <div className="flex items-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gray-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-10 text-lg leading-relaxed font-light">
                  "The AI understands our brand guidelines perfectly. Every presentation maintains our corporate
                  standards while delivering compelling narratives that drive results."
                </p>
                <div className="flex items-center">
                  <Avatar className="mr-4 w-14 h-14">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">AL</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-gray-900 font-medium">Amanda Lee</div>
                    <div className="text-gray-600 text-sm">Chief Marketing Officer, Salesforce</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm p-10">
              <CardContent className="p-0">
                <div className="flex items-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gray-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-10 text-lg leading-relaxed font-light">
                  "Our sales team's close rate increased by 40% after implementing PresentPro. The presentations are
                  simply more persuasive and professional."
                </p>
                <div className="flex items-center">
                  <Avatar className="mr-4 w-14 h-14">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">DK</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-gray-900 font-medium">David Kim</div>
                    <div className="text-gray-600 text-sm">Sales Director, HubSpot</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Simple
              <span className="block text-gray-600">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Choose the perfect plan for your presentation needs. All plans include our AI-powered generation engine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative">
              <CardHeader className="p-8 text-center">
                <CardTitle className="text-gray-900 text-xl font-medium mb-2">Starter</CardTitle>
                <div className="text-4xl font-light text-gray-900 mb-2">$29</div>
                <div className="text-gray-600 text-sm">per month</div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Up to 50 presentations/month
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Basic templates library
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    PowerPoint export
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Email support
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium h-12 text-sm tracking-wide">
                    START FREE TRIAL
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="bg-white border-2 border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white font-medium border-0 px-4 py-1">MOST POPULAR</Badge>
              </div>
              <CardHeader className="p-8 text-center">
                <CardTitle className="text-gray-900 text-xl font-medium mb-2">Professional</CardTitle>
                <div className="text-4xl font-light text-gray-900 mb-2">$79</div>
                <div className="text-gray-600 text-sm">per month</div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Unlimited presentations
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Premium templates library
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Multiple export formats
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Custom branding
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Priority support
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 text-sm tracking-wide">
                    START FREE TRIAL
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative">
              <CardHeader className="p-8 text-center">
                <CardTitle className="text-gray-900 text-xl font-medium mb-2">Enterprise</CardTitle>
                <div className="text-4xl font-light text-gray-900 mb-2">Custom</div>
                <div className="text-gray-600 text-sm">contact us</div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Unlimited everything
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Custom templates
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    API access
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    SSO integration
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Dedicated support
                  </li>
                </ul>
                <Link href="/contact" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium h-12 text-sm tracking-wide"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    CONTACT SALES
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-32 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl lg:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
            Enterprise
            <span className="block text-gray-600">Ready</span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Join Fortune 500 companies who trust PresentPro for their most important business presentations and
            executive communications.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-12 py-4 text-sm tracking-wide h-14"
              >
                START FREE TRIAL
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-12 py-4 text-sm tracking-wide h-14"
              >
                <Phone className="w-4 h-4 mr-2" />
                SCHEDULE DEMO
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-16">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Presentation className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-light text-gray-900 tracking-wide">PRESENTPRO</div>
              </div>
              <p className="text-gray-600 leading-relaxed max-w-md font-light">
                AI-powered presentation generation platform delivering professional-grade PowerPoint decks for
                executives and enterprises worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-6 text-sm tracking-wide uppercase">Product</h4>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <Link href="/presentation-planner" className="hover:text-gray-900 transition-colors">
                    AI Generator
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-gray-900 transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-gray-900 transition-colors">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-gray-900 transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-6 text-sm tracking-wide uppercase">Enterprise</h4>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <Link href="/upgrade" className="hover:text-gray-900 transition-colors">
                    Team Plans
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-gray-900 transition-colors">
                    Custom Branding
                  </Link>
                </li>
                <li>
                  <Link href="/api-access" className="hover:text-gray-900 transition-colors">
                    API Access
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-gray-900 transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-6 text-sm tracking-wide uppercase">Support</h4>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <Link href="/help" className="hover:text-gray-900 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gray-900 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-gray-900 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">&copy; 2024 PresentPro. All rights reserved.</p>
            <div className="flex items-center space-x-8 mt-4 lg:mt-0">
              <span className="text-gray-600 text-sm">SOC 2 Compliant</span>
              <span className="text-gray-600 text-sm">GDPR Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}