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
    prompt: "Create a sales discovery presentation for a Fortune 500 software company interested in digital transformation",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "Product Demo Deck",
    description: "Showcase solution capabilities and ROI",
    prompt: "Create a sales demo presentation for enterprise SaaS platform showing ROI and implementation roadmap",
    icon: Presentation,
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    title: "Executive Proposal",
    description: "C-suite proposal with business case",
    prompt: "Create executive sales proposal for healthcare company with competitive analysis and financial projections",
    icon: Briefcase,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "Closing Presentation",
    description: "Final pitch with pricing and next steps",
    prompt: "Create closing sales presentation for retail client with cost-benefit analysis and quick wins",
    icon: Target,
    color: "text-orange-600",
    bg: "bg-orange-50"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {salesExamples.map((example, idx) => {
            const Icon = example.icon
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer" 
                    onClick={() => generatePresentation(example.prompt)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${example.bg}`}>
                      <Icon className={`w-6 h-6 ${example.color}`} />
                    </div>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                  <CardTitle className="mt-4">{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Prompt:</strong> {example.prompt}
                  </p>
                  <div className="text-sm text-gray-500">
                    <p className="mb-1">Expected slides:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Executive Summary</li>
                      <li>Strategic Analysis (SWOT, Matrix)</li>
                      <li>Financial Projections (ROI, Cost-Benefit)</li>
                      <li>Implementation Plan (Roadmap, Quick Wins)</li>
                      <li>Competitive Positioning</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">How Sales-Specific Generation Works</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">1</div>
              <div>
                <strong>Intent Detection:</strong> AI analyzes prompt for sales keywords (discovery, demo, proposal, close) and industry context
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">2</div>
              <div>
                <strong>Slide Selection:</strong> Automatically chooses appropriate McKinsey-style slides based on sales stage
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">3</div>
              <div>
                <strong>Content Generation:</strong> Creates personalized content with industry-specific metrics and messaging
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">4</div>
              <div>
                <strong>Professional Rendering:</strong> React components ensure consistent McKinsey-quality formatting
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}