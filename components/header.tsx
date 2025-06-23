"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Presentation } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"
import { mockUser } from "@/lib/constants"

export function PrivateHeader() {
  const router = useRouter()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Presentation className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-light tracking-wide text-gray-900">PRESENTPRO</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push("/dashboard/presentations")}>
                Presentations
              </Button>
              <Button variant="ghost" onClick={() => router.push("/upgrade")}>
                Upgrade
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={() => router.push("/presentation-planner")} className="h-11 bg-gray-900 hover:bg-gray-800">
              Create Presentation
            </Button>
            <UserDropdown user={mockUser} />
          </div>
        </div>
      </div>
    </header>
  )
}