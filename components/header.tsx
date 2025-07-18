"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Presentation, BarChart3 } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"
import { mockUser } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function PrivateHeader() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Presentation className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-light tracking-wide text-gray-900">SALESPRO</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/dashboard/proposals" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-900",
                  pathname === "/dashboard/proposals" ? "text-gray-900" : "text-gray-600"
                )}
              >
                Proposals
              </Link>
              <Link 
                href="/analytics" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-900 flex items-center gap-1",
                  pathname === "/analytics" ? "text-gray-900" : "text-gray-600"
                )}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full ml-1">Soon</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={() => router.push("/presentation-planner")} className="h-11 bg-gray-900 hover:bg-gray-800">
              Create Proposal
            </Button>
            <UserDropdown user={mockUser} />
          </div>
        </div>
      </div>
    </header>
  )
}