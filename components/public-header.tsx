"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Presentation } from "lucide-react"

export function PublicHeader() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Presentation className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-light text-gray-900 tracking-wide">PRESENTPRO</div>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-12">
            <Link
              href="/#intelligent-generation"
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium tracking-wide"
            >
              FEATURES
            </Link>
            <Link
              href="/templates"
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium tracking-wide"
            >
              TEMPLATES
            </Link>
            <Link
              href="/#testimonials"
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium tracking-wide"
            >
              TESTIMONIALS
            </Link>
            <Link
              href="/#pricing"
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium tracking-wide"
            >
              PRICING
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/signin">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 text-sm font-medium tracking-wide">
                SIGN IN
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium tracking-wide px-8 h-11">
                GENERATE PRESENTATION
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}