"use client"

import Link from "next/link"
import { Presentation } from "lucide-react"

export function MinimalHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-light text-gray-900 tracking-wide">PRESENTPRO</span>
          </Link>
        </div>
      </div>
    </header>
  )
}