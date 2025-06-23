"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Presentation, Check, Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
// Removed header import - using minimal navigation for loading page // Assuming a shared header component
import { mockUser } from "@/lib/constants"

// Generation steps
const generationSteps = [
  { id: 1, title: "Analyzing requirements" },
  { id: 2, title: "Researching market data" },
  { id: 3, title: "Creating slide structure" },
  { id: 4, title: "Generating content" },
  { id: 5, title: "Designing visuals" },
  { id: 6, title: "Finalizing presentation" },
]

type StepStatus = "pending" | "in-progress" | "completed"

interface StepState {
  status: StepStatus
  progress: number
}

export default function PresentationLoadingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [presentationData, setPresentationData] = useState<any>(null)

  useEffect(() => {
    const storedData = sessionStorage.getItem("presentationData")
    if (storedData) setPresentationData(JSON.parse(storedData))

    const interval = setInterval(() => {
      setOverallProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 5 + 2, 100)
        const newCurrentStep = Math.floor((newProgress / 100) * generationSteps.length)
        setCurrentStep(newCurrentStep)

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            sessionStorage.removeItem("presentationData")
            router.push("/presentation-editor")
          }, 1500)
        }
        return newProgress
      })
    }, 800)

    return () => clearInterval(interval)
  }, [router])

  const getStepIcon = (index: number) => {
    if (index < currentStep) return <Check className="w-5 h-5 text-green-600" />
    if (index === currentStep && overallProgress < 100)
      return <Loader2 className="w-5 h-5 text-gray-900 animate-spin" />
    if (overallProgress >= 100) return <Check className="w-5 h-5 text-green-600" />
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal navigation for loading page */}
      <main className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl">
          {/* Main Loading Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center animate-in fade-in duration-1000">
            {/* Title Area */}
            <div className="mb-16 animate-in fade-in duration-1000 delay-200">
              {/* Animated Icon */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                  <Presentation className="w-12 h-12 text-white animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-yellow-500 animate-spin" style={{ animationDuration: "3s" }} />
                </div>
              </div>

              {/* Headings */}
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
                Generating Your
                <span className="block text-gray-600">
                  {presentationData?.type === "quick" ? "AI Presentation" : "Custom Presentation"}
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-4 font-light">
                {presentationData?.type === "quick"
                  ? "Our AI is analyzing your prompt and crafting your consulting-grade deck..."
                  : "Our AI is processing your detailed requirements and creating your custom presentation..."}
              </p>

              <p className="text-lg text-gray-500 font-light">This usually takes 2-3 minutes. Don't close this tab.</p>
            </div>

            {/* Progress Section */}
            <div className="mb-8">
              <Progress value={overallProgress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{Math.round(overallProgress)}% Complete</span>
                {overallProgress < 100 && (
                  <span>
                    Step {Math.min(currentStep + 1, generationSteps.length)} of {generationSteps.length}
                  </span>
                )}
              </div>
            </div>

            {/* Add this section after the progress section and before the steps display */}
            {presentationData && (
              <div className="mb-16 animate-in fade-in duration-1000 delay-600">
                <div className="bg-gray-50 rounded-xl p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">What we're creating:</h3>
                  {presentationData.type === "quick" ? (
                    <div className="text-gray-700">
                      <p className="text-sm text-gray-600 mb-2">Your prompt:</p>
                      <p className="italic bg-white p-4 rounded-lg border border-gray-200">
                        "{presentationData.prompt.substring(0, 200)}..."
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Presentation Details:</p>
                        <ul className="space-y-1 text-gray-700">
                          {presentationData.formData.title && <li>• Title: {presentationData.formData.title}</li>}
                          {presentationData.formData.slideCount && (
                            <li>• Slides: {presentationData.formData.slideCount}</li>
                          )}
                          {presentationData.formData.audience && (
                            <li>• Audience: {presentationData.formData.audience}</li>
                          )}
                          {presentationData.formData.purpose && <li>• Purpose: {presentationData.formData.purpose}</li>}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Content & Style:</p>
                        <ul className="space-y-1 text-gray-700">
                          {presentationData.formData.topic && <li>• Topic: {presentationData.formData.topic}</li>}
                          {presentationData.formData.templateStyle && (
                            <li>• Style: {presentationData.formData.templateStyle}</li>
                          )}
                          {presentationData.formData.keyPoints.filter((p: string) => p).length > 0 && (
                            <li>• Key Points: {presentationData.formData.keyPoints.filter((p: string) => p).length} items</li>
                          )}
                          {presentationData.formData.brandColors.length > 0 && (
                            <li>• Brand Colors: {presentationData.formData.brandColors.length} colors</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Steps Display */}
            <div className="space-y-4 animate-in fade-in duration-1000 delay-600">
              <h3 className="text-2xl font-light text-gray-900 mb-8 tracking-tight">Generation Process</h3>

              <div className="grid gap-4">
                {generationSteps.map((step, index) => {
                  const isActive = index === currentStep
                  const isCompleted = index < currentStep

                  return (
                    <div
                      key={step.id}
                      className={`
                        flex items-center space-x-4 p-6 rounded-xl border transition-all duration-500
                        ${
                          isActive
                            ? "bg-gray-50 border-gray-200 shadow-sm"
                            : isCompleted
                              ? "bg-green-50 border-green-200"
                              : "bg-white border-gray-100"
                        }
                        animate-in fade-in duration-500
                      `}
                      style={{ animationDelay: `${index * 100 + 800}ms` }}
                    >
                      {/* Step Icon */}
                      <div className="flex-shrink-0">{getStepIcon(index)}</div>

                      {/* Step Content */}
                      <div className="flex-1 text-left">
                        <h4 className={`font-medium ${isCompleted ? "text-green-900" : "text-gray-900"}`}>
                          {step.title}
                        </h4>
                      </div>

                      {/* Step Status */}
                      <div className="flex-shrink-0">
                        {isCompleted && (
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            DONE
                          </span>
                        )}
                        {isActive && (
                          <span className="text-xs font-medium text-gray-900 bg-gray-200 px-2 py-1 rounded-full animate-pulse">
                            PROCESSING
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer Message */}
            <div className="mt-16 p-6 bg-gray-50 rounded-xl animate-in fade-in duration-1000 delay-1000">
              <p className="text-gray-600 font-light">
                <span className="font-medium text-gray-900">Pro Tip:</span> While you wait, grab a coffee! Your
                presentation will be ready shortly with professional formatting, compelling content, and beautiful
                visuals.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}