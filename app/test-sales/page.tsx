"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Presentation, Briefcase, Users, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const salesExamples = [
  {
    title: "Discovery Call Deck",
    description: "Initial meeting to understand client needs",
    prompt: "Create a sales discovery presentation for a Fortune 500 software company interested in digital transformation, competing against Accenture and IBM",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "Product Demo Deck",
    description: "Showcase solution capabilities and ROI",
    prompt: "Create a sales demo presentation for enterprise SaaS platform showing ROI and implementation roadmap for a $50M manufacturing company with urgent timeline",
    icon: Presentation,
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    title: "Executive Proposal",
    description: "C-suite proposal with business case",
    prompt: "Create executive sales proposal for healthcare company struggling with patient data management, budget $2M, competitors Epic and Cerner",
    icon: Briefcase,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "Closing Presentation",
    description: "Final pitch with pricing and next steps",
    prompt: "Create closing sales presentation for retail client facing inventory management challenges, need quick wins within 30 days",
    icon: Target,
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    title: "Competitive Win-Back",
    description: "Win back lost opportunities",
    prompt: "Create a win-back presentation for a financial services firm currently using competitor solution, emphasizing our differentiators and migration path",
    icon: TrendingUp,
    color: "text-red-600",
    bg: "bg-red-50"
  },
  {
    title: "Partnership Proposal",
    description: "Strategic partnership pitch",
    prompt: "Create partnership proposal presentation for technology company showing mutual benefits, market expansion opportunities, and revenue sharing model",
    icon: Users,
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    title: "Renewal & Upsell",
    description: "Contract renewal with expansion",
    prompt: "Create renewal presentation for existing customer showing value delivered, new features, and expansion opportunities with 40% upsell target",
    icon: TrendingUp,
    color: "text-teal-600",
    bg: "bg-teal-50"
  },
  {
    title: "Industry Solution",
    description: "Vertical-specific value prop",
    prompt: "Create industry-specific sales deck for pharmaceutical company addressing regulatory compliance, supply chain efficiency, and R&D acceleration",
    icon: Briefcase,
    color: "text-amber-600",
    bg: "bg-amber-50"
  }
]

export default function TestSalesPage() {
  const router = useRouter()

  const generatePresentation = async (prompt: string) => {
    try {
      const response = await fetch("/api/presentations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        sessionStorage.setItem(
          "generatedPresentation",
          JSON.stringify({
            slides: result.data.slides,
            title: result.data.title,
            timestamp: Date.now()
          })
        )
        router.push("/presentation-viewer")
      }
    } catch (error) {
      console.error("Error generating presentation:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sales Presentation Templates
          </h1>
          <p className="text-gray-600">
            Test AI-powered sales presentations with McKinsey-style components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {salesExamples.map((example, idx) => {
            const Icon = example.icon
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer group" 
                    onClick={() => generatePresentation(example.prompt)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${example.bg} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${example.color}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4 text-lg">{example.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500 line-clamp-3">
                    {example.prompt}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Generate Presentation
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">AI-Powered Sales Slide Selection</h2>
            <Link href="/test-ai-generation">
              <Button variant="outline" size="sm">
                <Presentation className="w-4 h-4 mr-2" />
                Test AI Engine
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">1</div>
                  <div>
                    <strong>Context Extraction:</strong> AI extracts company name, challenges, competitors, budget, and timeline from your prompt
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">2</div>
                  <div>
                    <strong>Sales Stage Detection:</strong> Identifies if it's discovery, demo, proposal, or closing stage
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">3</div>
                  <div>
                    <strong>Smart Slide Selection:</strong> Chooses from 27 McKinsey templates based on context (e.g., adds competitive landscape if competitors mentioned)
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">4</div>
                  <div>
                    <strong>Personalized Content:</strong> Generates content specific to the company, industry, and challenges
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-2">Context-Based Slide Selection</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">If competitors →</span>
                  <span className="text-blue-600 font-medium">Adds Competitive Landscape</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">If urgent timeline →</span>
                  <span className="text-blue-600 font-medium">Adds Quick Wins</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">If budget mentioned →</span>
                  <span className="text-blue-600 font-medium">Adds ROI/Cost-Benefit</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">If challenges listed →</span>
                  <span className="text-blue-600 font-medium">Adds SWOT/Hypothesis Tree</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">If industry specific →</span>
                  <span className="text-blue-600 font-medium">Adds Market Sizing</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">If process issues →</span>
                  <span className="text-blue-600 font-medium">Adds Process Flow/Value Chain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}