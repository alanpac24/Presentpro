"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface EditUsageToastProps {
  show: boolean
  usage: number
  limit: number
  remaining: number
}

export function EditUsageToast({ show, usage, limit, remaining }: EditUsageToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="bg-gray-900 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-3">
            <p className="font-medium text-sm mb-1">
              Approaching edit limit
            </p>
            <p className="text-gray-300 text-xs">
              You've used {usage} of {limit} edits this month. 
              Only {remaining} edits remaining.
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}