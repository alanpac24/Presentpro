"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Presentation, Shield, Phone, ArrowRight, BarChart3, Zap, FileText, Target, Menu, X, Briefcase, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const testimonials = [
  {
    id: 1,
    quote: "Our sales team closed 40% more deals after switching to PresentPro Sales. The AI creates pitch decks that resonate with prospects and the McKinsey-style frameworks build instant credibility.",
    name: "Robert Martinez",
    title: "VP of Sales, Oracle",
    initials: "RM"
  },
  {
    id: 2,
    quote: "What used to take our sales team 2 days to create now takes 15 minutes. The competitive landscape slides and ROI calculators are exactly what enterprise buyers want to see.",
    name: "Sarah Chen",
    title: "Head of Enterprise Sales, Salesforce",
    initials: "SC"
  },
  {
    id: 3,
    quote: "PresentPro Sales transformed our win rate from 18% to 34%. The AI understands buyer psychology and creates presentations that move prospects from interest to action.",
    name: "Michael Torres",
    title: "Chief Revenue Officer, HubSpot",
    initials: "MT"
  },
  {
    id: 4,
    quote: "As a sales consultant, I create dozens of proposals monthly. PresentPro's sales templates follow proven frameworks that top performers use. It's like having a sales coach built-in.",
    name: "Amanda Lee",
    title: "Senior Sales Director, Microsoft",
    initials: "AL"
  },
  {
    id: 5,
    quote: "The contextual slide selection is brilliant. Mention competitors and it adds competitive analysis. Mention budget and it includes ROI calculations. It thinks like a seasoned sales pro.",
    name: "David Kim",
    title: "VP of Sales Enablement, Stripe",
    initials: "DK"
  },
  {
    id: 6,
    quote: "Our average deal size increased 65% after implementing PresentPro Sales. The business case slides and executive summaries help us sell to C-level prospects effectively.",
    name: "Jennifer Wu",
    title: "Regional Sales Manager, Adobe",
    initials: "JW"
  },
  {
    id: 7,
    quote: "PresentPro Sales eliminated the back-and-forth with marketing for slide decks. Our reps can generate professional, on-brand presentations instantly and focus on selling.",
    name: "Carlos Rodriguez",
    title: "Sales Operations Director, Zoom",
    initials: "CR"
  },
  {
    id: 8,
    quote: "The industry-specific content is spot-on. When selling to healthcare, it knows compliance requirements. For financial services, it includes regulatory considerations automatically.",
    name: "Lisa Park",
    title: "Enterprise Account Executive, Amazon",
    initials: "LP"
  },
  {
    id: 9,
    quote: "Our sales cycle shortened from 8 months to 5 months. The compelling narratives and professional visuals help prospects envision the value faster than ever before.",
    name: "James Wilson",
    title: "Senior Sales Manager, IBM",
    initials: "JW"
  }
]

// Logo Carousel Component
const LogoCarousel = () => {
  const companies = [
    'Microsoft', 'Google', 'Amazon', 'Meta', 'Apple',
    'McKinsey', 'BCG', 'Bain', 'Deloitte', 'PwC',
    'Goldman Sachs', 'JP Morgan', 'Morgan Stanley',
    'Stanford', 'Harvard', 'MIT', 'Wharton',
    'Salesforce', 'Oracle', 'SAP', 'Adobe'
  ]

  return (
    <section className="py-16 sm:py-20 overflow-hidden bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-600 text-sm font-medium tracking-wide uppercase mb-10">
          Used by professionals from
        </p>
        <div className="relative">
          <div className="flex space-x-16 animate-scroll">
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 text-2xl font-light text-gray-400 hover:text-gray-600 transition-colors duration-200"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Slide Generator Component
const SlideGenerator = () => {
  const [phase, setPhase] = useState<'typing' | 'thinking' | 'accordion'>('typing')
  const [typedText, setTypedText] = useState('')
  const [thinkingMessage, setThinkingMessage] = useState('Analyzing requirements...')
  const [expandedPanel, setExpandedPanel] = useState<number | null>(null)
  const animationRef = useRef<boolean>(true)
  
  // Massively slowed down timings (3x slower)
  const TYPING_SPEED = 102 // was 34ms
  const THINKING_DURATION = 7290 // was 2430ms
  const ACCORDION_EXPAND_DURATION = 810 // was 270ms
  const ACCORDION_ZOOM_DURATION = 2835 // was 945ms
  
  const PROMPT_TEXT = "Create sales proposal pitch deck for Park Financial Group for Head of Product - Joyce Tucker"
  const THINKING_MESSAGES = [
    "Analyzing requirements...",
    "Researching Park Financial Group...",
    "Understanding product roadmap...",
    "Crafting value propositions...",
    "Generating slide content..."
  ]
  
  const slides = [
    { id: 1, title: "Executive Summary", header: "Digital Innovation Platform for Park Financial" },
    { id: 2, title: "Value Proposition", header: "Strategic Product Enhancement Metrics" },
    { id: 3, title: "Implementation Plan", header: "Product Development Roadmap" },
    { id: 4, title: "Key Features", header: "Platform Capabilities for Park Financial" },
    { id: 5, title: "Next Steps", header: "Action Plan for Joyce Tucker" }
  ]
  
  // Slide content components
  const SlideContent = ({ slideId }: { slideId: number }) => {
    switch (slideId) {
      case 1:
        return (
          <div className="h-full bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2 text-xs font-semibold">
              Digital Innovation Platform for Park Financial
            </div>
            <div className="p-4 h-[calc(100%-32px)]">
              <div className="grid grid-cols-[1.6fr_1fr] gap-3 h-full">
                <div>
                  <div className="text-[10px] text-gray-600 mb-2">Development Acceleration</div>
                  <div className="flex gap-1 items-end h-16">
                    <div className="flex-1 bg-blue-600 rounded-t" style={{ height: '30%' }}></div>
                    <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '55%' }}></div>
                    <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '80%' }}></div>
                    <div className="flex-1 bg-blue-300 rounded-t" style={{ height: '95%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[8px] text-gray-500">
                    <span>Q1</span>
                    <span>Q2</span>
                    <span>Q3</span>
                    <span>Q4</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-blue-900 text-white p-2 rounded text-center">
                    <div className="text-sm font-bold">85%</div>
                    <div className="text-[8px]">Faster Launch</div>
                  </div>
                  <div className="bg-blue-700 text-white p-2 rounded text-center">
                    <div className="text-sm font-bold">$4.7M</div>
                    <div className="text-[8px]">Revenue Uplift</div>
                  </div>
                  <div className="bg-blue-500 text-white p-2 rounded text-center">
                    <div className="text-sm font-bold">92%</div>
                    <div className="text-[8px]">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="h-full bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2 text-xs font-semibold">
              Strategic Product Enhancement Metrics
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-600">
                  <div className="text-2xl font-bold text-blue-900">85%</div>
                  <div className="text-[10px] text-gray-600 font-medium">Faster Launch</div>
                </div>
                <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-600">
                  <div className="text-2xl font-bold text-blue-900">3.8x</div>
                  <div className="text-[10px] text-gray-600 font-medium">Dev Velocity</div>
                </div>
                <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-600">
                  <div className="text-2xl font-bold text-blue-900">$4.7M</div>
                  <div className="text-[10px] text-gray-600 font-medium">Revenue Uplift</div>
                </div>
                <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-600">
                  <div className="text-2xl font-bold text-blue-900">92%</div>
                  <div className="text-[10px] text-gray-600 font-medium">User Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="h-full bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2 text-xs font-semibold">
              Product Development Roadmap
            </div>
            <div className="p-4 flex items-center justify-center h-[calc(100%-32px)]">
              <div className="relative w-full">
                <div className="absolute top-7 left-0 right-0 h-0.5 bg-gray-300"></div>
                <div className="flex justify-between relative">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">1</div>
                    <div className="text-[10px] text-gray-600 leading-tight">Design<br/>3 weeks</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">2</div>
                    <div className="text-[10px] text-gray-600 leading-tight">Build<br/>6 weeks</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">3</div>
                    <div className="text-[10px] text-gray-600 leading-tight">Test<br/>4 weeks</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">4</div>
                    <div className="text-[10px] text-gray-600 leading-tight">Deploy<br/>2 weeks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="h-full bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2 text-xs font-semibold">
              Platform Capabilities for Park Financial
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                <span className="text-xs text-gray-700">Low-code product builder with 200+ components</span>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                <span className="text-xs text-gray-700">API-first architecture for seamless integrations</span>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                <span className="text-xs text-gray-700">Real-time customer analytics dashboard</span>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                <span className="text-xs text-gray-700">A/B testing framework with ML optimization</span>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                <span className="text-xs text-gray-700">White-label customization for Park brand</span>
              </div>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="h-full bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2 text-xs font-semibold">
              Action Plan for Joyce Tucker
            </div>
            <div className="p-4 space-y-2">
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-3 rounded text-xs">Week 1: Product workshop & requirements</div>
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-3 rounded text-xs">Week 2: Platform demo with engineering</div>
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-3 rounded text-xs">Week 3: Mobile banking pilot program</div>
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-3 rounded text-xs">Week 4: Partnership & implementation</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    const runAnimation = async () => {
      if (!animationRef.current) return
      
      // Reset state
      setPhase('typing')
      setTypedText('')
      setExpandedPanel(null)
      
      // Typing phase
      for (let i = 0; i <= PROMPT_TEXT.length; i++) {
        if (!animationRef.current) return
        setTypedText(PROMPT_TEXT.substring(0, i))
        await new Promise(resolve => setTimeout(resolve, 80))
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Thinking phase
      setPhase('thinking')
      let messageIndex = 0
      const messageInterval = setInterval(() => {
        if (!animationRef.current) {
          clearInterval(messageInterval)
          return
        }
        messageIndex = (messageIndex + 1) % THINKING_MESSAGES.length
        setThinkingMessage(THINKING_MESSAGES[messageIndex])
      }, 800)
      
      await new Promise(resolve => setTimeout(resolve, 4000))
      clearInterval(messageInterval)
      
      // Accordion phase
      setPhase('accordion')
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Animate panels
      for (let i = 0; i < slides.length; i++) {
        if (!animationRef.current) return
        setExpandedPanel(i)
        await new Promise(resolve => setTimeout(resolve, 2500))
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Loop
      if (animationRef.current) {
        runAnimation()
      }
    }
    
    runAnimation()
    
    return () => {
      animationRef.current = false
    }
  }, [])
  
  return (
    <div className="w-full max-w-[450px] h-[450px] bg-white rounded-2xl overflow-hidden relative">
      <div className="w-full h-full relative flex items-center justify-center p-4">
        {/* Typing Phase */}
        {phase === 'typing' && (
          <div className="w-full">
            <div className="bg-white border-2 border-gray-200 rounded-md px-4 py-3 text-sm shadow-sm">
              <span className="text-gray-700">{typedText}</span>
              <span className="inline-block w-0.5 h-4 bg-gray-700 ml-0.5 animate-pulse" />
            </div>
          </div>
        )}
        
        {/* Thinking Phase */}
        {phase === 'thinking' && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-full animate-pulse shadow-lg" />
              </div>
              <div className="absolute inset-0 animate-spin">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <div className="absolute top-1/4 right-[15%] w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <div className="absolute bottom-1/4 right-[15%] w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <div className="absolute bottom-1/4 left-[15%] w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <div className="absolute top-1/4 left-[15%] w-1.5 h-1.5 bg-blue-600 rounded-full" />
              </div>
            </div>
            <p className="text-xs text-gray-600 animate-pulse">{thinkingMessage}</p>
          </div>
        )}
        
        {/* Accordion Phase */}
        {phase === 'accordion' && (
          <div className="w-full h-full py-2">
            {slides.map((slide, idx) => {
              return (
              <div
                key={slide.id}
                className={`bg-white border border-gray-200 rounded-md mb-1 overflow-hidden transition-all duration-300 ${
                  expandedPanel === idx ? 'h-48 shadow-lg scale-[1.02]' : 'h-8'
                }`}
              >
                <div className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-200 h-8 flex items-center">
                  Slide {slide.id}: {slide.title}
                </div>
                {expandedPanel === idx && (
                  <div className="p-2 opacity-100 transition-opacity duration-300">
                    <div className="bg-white border border-gray-300 rounded-sm h-full overflow-hidden shadow-sm">
                      <div className="bg-blue-600 text-white px-2.5 py-1.5 text-[10px] font-semibold">
                        {slide.header}
                      </div>
                      <div className="p-2 h-32">
                        {/* Slide-specific content */}
                        {slide.id === 1 && (
                          <div className="grid grid-cols-[1.6fr_1fr] gap-2 h-full">
                            <div>
                              <div className="text-[9px] text-gray-600 mb-1.5">Development Acceleration</div>
                              <div className="flex gap-1 items-end h-14">
                                <div className="flex-1 bg-blue-600 rounded-t" style={{ height: '30%' }} />
                                <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '55%' }} />
                                <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '80%' }} />
                                <div className="flex-1 bg-blue-300 rounded-t" style={{ height: '95%' }} />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="bg-blue-600 text-white p-1 rounded text-center">
                                <div className="text-[11px] font-bold">85%</div>
                                <div className="text-[7px]">Faster Launch</div>
                              </div>
                              <div className="bg-blue-600 text-white p-1 rounded text-center">
                                <div className="text-[11px] font-bold">$4.7M</div>
                                <div className="text-[7px]">Revenue</div>
                              </div>
                            </div>
                          </div>
                        )}
                        {slide.id === 2 && (
                          <div className="grid grid-cols-2 gap-1 h-full">
                            {[['85%', 'Faster Launch'], ['3.8x', 'Dev Velocity'], ['$4.7M', 'Revenue'], ['92%', 'Satisfaction']].map(
                              ([value, label], i) => (
                                <div key={i} className="bg-gray-50 p-2 rounded border-l-2 border-blue-600">
                                  <div className="text-base font-bold text-blue-700">{value}</div>
                                  <div className="text-[9px] text-gray-600">{label}</div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {slide.id === 3 && (
                          <div className="flex justify-between items-center h-full px-2">
                            {['Design\n3 weeks', 'Build\n6 weeks', 'Test\n4 weeks', 'Deploy\n2 weeks'].map((phase, i) => (
                              <div key={i} className="text-center">
                                <div className="w-7 h-7 bg-blue-600 rounded-full text-white text-xs font-bold flex items-center justify-center mb-1">
                                  {i + 1}
                                </div>
                                <div className="text-[9px] text-gray-600 whitespace-pre-line leading-tight">{phase}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {slide.id === 4 && (
                          <div className="space-y-1.5">
                            {[
                              'Low-code product builder with 200+ components',
                              'API-first architecture for seamless integrations',
                              'Real-time customer analytics dashboard',
                              'A/B testing framework with ML optimization'
                            ].map((feature, i) => (
                              <div key={i} className="flex items-start text-[10px]">
                                <div className="w-4 h-4 bg-blue-600 rounded-full text-white text-[10px] flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                  ✓
                                </div>
                                <span className="leading-tight">{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {slide.id === 5 && (
                          <div className="space-y-1">
                            {[
                              'Week 1: Product workshop & requirements',
                              'Week 2: Platform demo with engineering',
                              'Week 3: Mobile banking pilot program',
                              'Week 4: Partnership & implementation'
                            ].map((action, i) => (
                              <div
                                key={i}
                                className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-2 py-1.5 rounded text-[9px] leading-tight"
                              >
                                {action}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PresentationProAI() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isYearly, setIsYearly] = useState(false)

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

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return

    const totalGroups = Math.ceil(testimonials.length / 3)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % totalGroups)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isPaused])

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
                <div className="text-2xl font-light text-gray-900 tracking-wide">PRESENTPRO SALES</div>
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
                <Button className="bg-gray-900 hover:bg-blue-600 text-white text-sm font-medium tracking-wide px-6 sm:px-8 h-10 sm:h-11 btn-scale">
                  GENERATE PRESENTATION
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
                  <Button className="w-full bg-gray-900 hover:bg-blue-600 btn-enhanced">
                    GENERATE PRESENTATION
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
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-xs font-medium tracking-wide uppercase mb-8 lg:mb-12">
                AI-Powered Sales Presentation Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight leading-[0.9]">
                Close more deals with
                <span className="block font-normal">AI-powered sales decks</span>
                <span className="block text-gray-600">that convert prospects.</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-10 sm:mb-12 leading-relaxed font-light">
                Generate winning sales presentations in minutes with AI that understands buyer psychology, 
                competitive positioning, and proven sales frameworks that convert prospects into customers.
              </p>

              {/* Search Interface */}
              <div className="">
                <div className="relative">
                  <Input
                    placeholder="Enterprise SaaS demo for Fortune 500 CFO, competing against Workday"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 pl-6 pr-40 text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg"
                  />
                  <Link href="/signup">
                    <Button className="absolute right-2 top-2 h-10 bg-gray-900 hover:bg-blue-600 text-white text-sm font-medium px-6 rounded-md btn-enhanced">
                      CREATE SALES DECK
                      <ArrowRight className="w-4 h-4 ml-2 arrow-animate" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right content - Slide Generator */}
            <div className="flex justify-center lg:justify-end">
              <SlideGenerator />
            </div>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Platform Overview */}
      <section id="intelligent-generation" className="py-24 lg:py-32 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-5xl lg:text-6xl font-light text-gray-900 mb-8 tracking-tight leading-tight">
                Sales-Focused
                <span className="block text-gray-600">AI Engine</span>
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed font-light">
                Our sales-trained AI engine creates more than just slides — it builds compelling sales narratives 
                that mirror how top-performing sales teams communicate, persuade prospects, and close deals.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Target className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sales-Optimized Content</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Each deck uses proven sales frameworks and buyer psychology. No more generic pitches — 
                      just targeted messaging that resonates with prospects and drives conversions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Briefcase className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Enterprise Sales Quality</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Trained on thousands of winning sales decks from top-performing enterprise sales teams. 
                      Every slide follows proven patterns that convert prospects into customers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Target className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Proven Sales Templates</h3>
                    <p className="text-gray-600 leading-relaxed">
                      500+ sales-focused templates: competitive analysis, ROI calculators, value props, 
                      case studies, and layouts optimized for discovery, demo, proposal, and closing stages.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 mb-6">Sales Scenarios & Use Cases</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-900 font-medium">Discovery Call</span>
                  </div>
                  <div className="text-sm text-gray-600">Pain points → current state → challenges → qualification → next steps</div>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-900 font-medium">Product Demo</span>
                  </div>
                  <div className="text-sm text-gray-600">Solution overview → features → benefits → ROI → competitive advantage</div>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-900 font-medium">Executive Proposal</span>
                  </div>
                  <div className="text-sm text-gray-600">Business case → investment → returns → timeline → decision criteria</div>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-900 font-medium">Competitive Win-Back</span>
                  </div>
                  <div className="text-sm text-gray-600">Differentiation → migration plan → risk mitigation → value realization</div>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-900 font-medium">Contract Renewal</span>
                  </div>
                  <div className="text-sm text-gray-600">Value delivered → new features → expansion → pricing → partnership</div>
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
            <Link href="/templates">
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group relative">
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Business review presentation template"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Hover overlay with slide outline */}
                  <div className="absolute inset-0 bg-gray-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 overflow-y-auto">
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Presentation Outline</h4>
                    <div className="space-y-2">
                      {[
                        "Title & Agenda",
                        "Executive Summary",
                        "Company Overview",
                        "Key Performance Indicators",
                        "Financial Performance",
                        "Revenue Analysis",
                        "Cost Structure",
                        "Market Analysis",
                        "Competitive Landscape",
                        "Product Performance",
                        "Customer Insights",
                        "Sales Pipeline",
                        "Marketing Initiatives",
                        "Operational Efficiency",
                        "Team Performance",
                        "Strategic Initiatives",
                        "Risk Assessment",
                        "Opportunities",
                        "Challenges",
                        "Action Plan",
                        "Timeline & Milestones",
                        "Resource Requirements",
                        "Next Steps",
                        "Q&A",
                        "Appendix"
                      ].map((slide, idx) => (
                        <div key={idx} className="flex items-start text-xs">
                          <span className="text-gray-400 mr-3 font-mono text-[10px] mt-0.5">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="text-gray-200 leading-relaxed">{slide}</span>
                        </div>
                      ))}
                    </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="font-medium">25 Slides</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Sales Pitch Template */}
            <Link href="/templates">
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group relative">
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Sales pitch presentation template"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Hover overlay with slide outline */}
                  <div className="absolute inset-0 bg-gray-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 overflow-y-auto">
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Presentation Outline</h4>
                    <div className="space-y-2">
                      {[
                        "Title Slide",
                        "Problem Statement",
                        "Market Opportunity",
                        "Our Solution",
                        "Value Proposition",
                        "Product Demo",
                        "Key Features",
                        "Benefits Overview",
                        "Customer Success Stories",
                        "Case Study 1",
                        "Case Study 2",
                        "ROI Analysis",
                        "Implementation Process",
                        "Pricing Options",
                        "Comparison Chart",
                        "Why Choose Us",
                        "Next Steps",
                        "Contact Information"
                      ].map((slide, idx) => (
                        <div key={idx} className="flex items-start text-xs">
                          <span className="text-gray-400 mr-3 font-mono text-[10px] mt-0.5">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="text-gray-200 leading-relaxed">{slide}</span>
                        </div>
                      ))}
                    </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="font-medium">18 Slides</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Strategy Template */}
            <Link href="/templates">
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group relative">
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Strategy presentation template"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Hover overlay with slide outline */}
                  <div className="absolute inset-0 bg-gray-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 overflow-y-auto">
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Presentation Outline</h4>
                    <div className="space-y-2">
                      {[
                        "Strategic Vision",
                        "Executive Summary",
                        "Current State Analysis",
                        "Market Overview",
                        "Industry Trends",
                        "Competitive Landscape",
                        "SWOT Analysis",
                        "Customer Insights",
                        "Strategic Objectives",
                        "Key Initiatives",
                        "Product Strategy",
                        "Market Expansion",
                        "Digital Transformation",
                        "Innovation Pipeline",
                        "Partnership Strategy",
                        "Financial Projections",
                        "Resource Planning",
                        "Risk Management",
                        "Implementation Roadmap",
                        "Q1 Milestones",
                        "Q2 Milestones",
                        "Q3 Milestones",
                        "Q4 Milestones",
                        "Success Metrics",
                        "Governance Model",
                        "Communication Plan",
                        "Change Management",
                        "Investment Requirements",
                        "Expected ROI",
                        "Next Steps",
                        "Q&A",
                        "Appendices"
                      ].map((slide, idx) => (
                        <div key={idx} className="flex items-start text-xs">
                          <span className="text-gray-400 mr-3 font-mono text-[10px] mt-0.5">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="text-gray-200 leading-relaxed">{slide}</span>
                        </div>
                      ))}
                    </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="font-medium">32 Slides</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/templates">
              <Button className="bg-gray-900 hover:bg-blue-600 text-white font-medium h-12 px-8 text-sm tracking-wide btn-enhanced group">
                SEE MORE TEMPLATES
                <ArrowRight className="w-4 h-4 ml-2 arrow-animate" />
              </Button>
            </Link>
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

          <div className="relative">
            {/* Testimonial Carousel */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {testimonials.slice(currentTestimonial * 3, (currentTestimonial * 3) + 3).map((testimonial, index) => (
                <Card
                  key={testimonial.id}
                  className="bg-white border-0 shadow-sm p-10 transition-all duration-500 opacity-100 transform scale-100"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gray-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-10 text-lg leading-relaxed font-light">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="mr-4 w-14 h-14 hover:scale-110 transition-transform duration-200">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-gray-900 font-medium">{testimonial.name}</div>
                        <div className="text-gray-600 text-sm">{testimonial.title}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center mt-12 space-x-2">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-gray-900 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial group ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 lg:px-8">
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
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative flex flex-col">
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
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-gray-900 hover:bg-blue-600 text-white font-medium h-12 text-sm tracking-wide btn-enhanced">
                      GET STARTED FREE
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-white border-2 border-blue-600 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative transform scale-105 flex flex-col">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white font-medium border-0 px-4 py-1">MOST POPULAR</Badge>
              </div>
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
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 text-sm tracking-wide btn-enhanced">
                      UPGRADE TO PRO
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative flex flex-col">
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
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-gray-900 hover:bg-blue-600 text-white font-medium h-12 text-sm tracking-wide btn-enhanced">
                      GO PROFESSIONAL
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Presentation className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-light text-gray-900 tracking-wide">PRESENTPRO SALES</div>
              </div>
              <p className="text-gray-600 leading-relaxed max-w-md font-light text-sm">
                AI-powered sales presentation platform for revenue teams.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-4 text-sm tracking-wide uppercase">Product</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li>
                  <a href="#pricing" className="hover:text-gray-900 transition-colors cursor-pointer">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-gray-900 transition-colors">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-4 text-sm tracking-wide uppercase">Legal</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li>
                  <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-gray-900 transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-gray-600 text-sm">&copy; 2024 PresentPro Sales. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}