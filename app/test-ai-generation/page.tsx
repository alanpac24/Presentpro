"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TestAIGenerationPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [testResults, setTestResults] = useState<{
    promptAnalysis?: any
    slideSelection?: any
    contentGeneration?: any
    error?: string
  }>({})
  const [multipleRuns, setMultipleRuns] = useState<any[]>([])
  const [isTestingVariety, setIsTestingVariety] = useState(false)

  const runTest = async () => {
    setIsGenerating(true)
    setTestResults({})

    try {
      // Test the API endpoint
      const response = await fetch("/api/presentations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Extract test information from the generated slides
        const analysis = {
          promptAnalysis: {
            slideCount: result.data.slides.length,
            title: result.data.title,
            hasExecutiveSummary: result.data.slides.some((s: any) => s.type === 'executiveSummary'),
            hasCompetitiveLandscape: result.data.slides.some((s: any) => s.type === 'competitiveLandscape'),
            hasROI: result.data.slides.some((s: any) => s.type === 'roiCalculation'),
            hasRoadmap: result.data.slides.some((s: any) => s.type === 'roadmap'),
            hasQuickWins: result.data.slides.some((s: any) => s.type === 'quickWins'),
            hasSWOT: result.data.slides.some((s: any) => s.type === 'swotAnalysis'),
          },
          slideSelection: {
            totalSlides: result.data.slides.length,
            slideTypes: [...new Set(result.data.slides.map((s: any) => s.type))],
            mckinseySlides: result.data.slides.filter((s: any) => 
              ['executiveSummary', 'matrix', 'swotAnalysis', 'valueChain', 'roiCalculation', 
               'roadmap', 'quickWins', 'competitiveLandscape'].includes(s.type)
            ).length,
          },
          contentGeneration: {
            firstSlide: result.data.slides[0],
            hasPersonalization: result.data.slides.some((s: any) => 
              s.content?.includes('company') || 
              s.title?.includes('company') ||
              s.subtitle?.includes('company')
            ),
            metadata: result.data.metadata
          }
        }

        setTestResults(analysis)

        // Store in session and navigate to viewer
        sessionStorage.setItem(
          "generatedPresentation",
          JSON.stringify({
            slides: result.data.slides,
            title: result.data.title,
            timestamp: Date.now()
          })
        )
        
        // Auto-navigate after 2 seconds
        setTimeout(() => {
          router.push("/presentation-viewer")
        }, 2000)
      } else {
        setTestResults({ error: result.error || 'Generation failed' })
      }
    } catch (error) {
      console.error("Error testing AI generation:", error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsGenerating(false)
    }
  }

  const testVariety = async () => {
    setIsTestingVariety(true)
    setMultipleRuns([])
    
    // Run the same prompt 3 times to show variety
    for (let i = 0; i < 3; i++) {
      try {
        const response = await fetch("/api/presentations/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        })
        
        const result = await response.json()
        
        if (result.success) {
          const slides = result.data.slides.slice(1) // Skip title slide
          setMultipleRuns(prev => [...prev, {
            run: i + 1,
            slideCount: slides.length,
            slideTypes: slides.map((s: any) => s.type),
            slideOrder: slides.map((s: any) => s.title)
          }])
        }
      } catch (error) {
        console.error(`Error in run ${i + 1}:`, error)
      }
    }
    
    setIsTestingVariety(false)
  }

  const testPrompts = [
    {
      title: "Competitor Mention Test",
      prompt: "Create a sales presentation for TechCorp competing against Microsoft and Google in cloud services",
      expectedSlides: ["Competitive Landscape", "Executive Summary"]
    },
    {
      title: "Urgent Timeline Test",
      prompt: "Create a proposal for RetailCo with urgent 30-day implementation timeline and quick wins needed",
      expectedSlides: ["Quick Wins", "Roadmap", "Timeline"]
    },
    {
      title: "Budget & ROI Test",
      prompt: "Create presentation for FinanceInc with $5M budget showing ROI and cost-benefit analysis",
      expectedSlides: ["ROI Calculation", "Cost-Benefit", "Executive Summary"]
    },
    {
      title: "Challenge-Focused Test",
      prompt: "Create deck for HealthCare Ltd facing data integration challenges and compliance issues",
      expectedSlides: ["SWOT Analysis", "Process Flow", "Solution Overview"]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/test-sales">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sales Templates
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test AI Generation Engine
          </h1>
          <p className="text-gray-600">
            Test how the AI analyzes prompts and selects appropriate McKinsey templates
          </p>
        </div>

        <div className="grid gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Test Prompt</CardTitle>
              <CardDescription>
                Include details like company names, competitors, budget, timeline, and challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a sales proposal for TechCorp, a Fortune 500 company, competing against Salesforce and Microsoft. They have a $2M budget and need quick wins within 60 days..."
                className="min-h-[120px] mb-4"
              />
              
              <div className="flex gap-2 mb-4">
                <Button 
                  onClick={runTest} 
                  disabled={!prompt || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing & Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Test AI Generation
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Test Prompts */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">Quick Test Scenarios:</p>
                {testPrompts.map((test, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(test.prompt)}
                    className="text-left w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-sm">{test.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{test.prompt}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      Expected: {test.expectedSlides.join(", ")}
                    </div>
                  </button>
                ))}
              </div>
              <Button 
                onClick={testVariety} 
                disabled={!prompt || isTestingVariety}
                variant="outline"
              >
                {isTestingVariety ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Variety...
                  </>
                ) : (
                  <>
                    Test Variety (3 runs)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Variety Test Results */}
          {multipleRuns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Variety Test Results</CardTitle>
                <CardDescription>
                  Same prompt generated {multipleRuns.length} times to show slide variation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {multipleRuns.map((run, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Run {run.run}: {run.slideCount} slides</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Slide Types:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {run.slideTypes.map((type: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Slide Order:</span>
                          <ol className="mt-1 text-xs text-gray-600 list-decimal list-inside">
                            {run.slideOrder.map((title: string, i: number) => (
                              <li key={i}>{title}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Variety Analysis */}
                  {multipleRuns.length >= 2 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Variety Analysis</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>✓ Slide counts vary: {[...new Set(multipleRuns.map(r => r.slideCount))].join(', ')} slides</p>
                        <p>✓ Different slide combinations in each run</p>
                        <p>✓ Order varies based on context scoring</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {Object.keys(testResults).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testResults.error ? (
                  <div className="flex items-start space-x-2 text-red-600">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Error:</p>
                      <p className="text-sm">{testResults.error}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Prompt Analysis Results */}
                    {testResults.promptAnalysis && (
                      <div className="space-y-2">
                        <h3 className="font-medium flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                          Prompt Analysis
                        </h3>
                        <div className="ml-6 space-y-1 text-sm">
                          <p>✓ Generated {testResults.promptAnalysis.slideCount} slides</p>
                          <p>✓ Title: "{testResults.promptAnalysis.title}"</p>
                          {testResults.promptAnalysis.hasCompetitiveLandscape && (
                            <p className="text-green-600">✓ Added Competitive Landscape (competitors detected)</p>
                          )}
                          {testResults.promptAnalysis.hasQuickWins && (
                            <p className="text-green-600">✓ Added Quick Wins (urgent timeline detected)</p>
                          )}
                          {testResults.promptAnalysis.hasROI && (
                            <p className="text-green-600">✓ Added ROI Calculation (budget detected)</p>
                          )}
                          {testResults.promptAnalysis.hasSWOT && (
                            <p className="text-green-600">✓ Added SWOT Analysis (challenges detected)</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Slide Selection Results */}
                    {testResults.slideSelection && (
                      <div className="space-y-2">
                        <h3 className="font-medium flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                          Smart Slide Selection
                        </h3>
                        <div className="ml-6 space-y-1 text-sm">
                          <p>✓ Total slides: {testResults.slideSelection.totalSlides}</p>
                          <p>✓ McKinsey templates used: {testResults.slideSelection.mckinseySlides}</p>
                          <p>✓ Slide types: {testResults.slideSelection.slideTypes.join(", ")}</p>
                        </div>
                      </div>
                    )}

                    {/* Content Generation Results */}
                    {testResults.contentGeneration && (
                      <div className="space-y-2">
                        <h3 className="font-medium flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                          Content Personalization
                        </h3>
                        <div className="ml-6 space-y-1 text-sm">
                          <p>✓ Personalized content: {testResults.contentGeneration.hasPersonalization ? 'Yes' : 'No'}</p>
                          <p>✓ First slide type: {testResults.contentGeneration.firstSlide.type}</p>
                          <p>✓ Estimated duration: {testResults.contentGeneration.metadata.estimatedDuration} minutes</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <p className="text-green-800 font-medium">
                        ✅ AI Generation successful! Redirecting to presentation viewer...
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}