"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
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
    if (index < currentStep) return <Check className="w-5 h-5 text-blue-600" />
    if (index === currentStep && overallProgress < 100)
      return <Loader2 className="w-5 h-5 text-gray-900 animate-spin" />
    if (overallProgress >= 100) return <Check className="w-5 h-5 text-blue-600" />
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
  }

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      <main className="bg-gray-50 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Loading Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12 text-center max-w-4xl mx-auto">
            {/* Title Area */}
            <div className="mb-12">
              {/* Headings */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-3 sm:mb-4">
                Generating Your Presentation
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
                {presentationData?.type === "quick"
                  ? "Our AI is analyzing your prompt and creating your presentation."
                  : "Processing your requirements and building your custom presentation."}
              </p>
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


            {/* Steps Display */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900 mb-6">Status</h3>

              <div className="grid gap-4">
                {generationSteps.map((step, index) => {
                  const isActive = index === currentStep
                  const isCompleted = index < currentStep

                  return (
                    <div
                      key={step.id}
                      className={`
                        flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300
                        ${
                          isActive
                            ? "bg-gray-50 border-gray-900"
                            : isCompleted
                              ? "bg-blue-50 border-blue-200"
                              : "bg-white border-gray-200"
                        }
                      `}
                    >
                      {/* Step Icon */}
                      <div className="flex-shrink-0">{getStepIcon(index)}</div>

                      {/* Step Content */}
                      <div className="flex-1 text-left">
                        <h4 className={`font-medium ${isCompleted ? "text-blue-900" : "text-gray-900"}`}>
                          {step.title}
                        </h4>
                      </div>

                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer Message */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
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