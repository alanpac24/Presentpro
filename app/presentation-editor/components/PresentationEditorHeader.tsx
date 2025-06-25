"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, Share2, Download, Copy, Check, X, Edit3, PresentationIcon, History } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserDropdown } from "@/components/user-dropdown"
import { validatePresentationTitle } from "@/lib/validation"

interface PresentationEditorHeaderProps {
  title: string
  onTitleChange: (title: string) => void
  isAutoSaving: boolean
  onVersionHistory?: () => void
}

export function PresentationEditorHeader({ title, onTitleChange, isAutoSaving, onVersionHistory }: PresentationEditorHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const [error, setError] = useState<string | null>(null)

  const saveTitle = () => {
    const validation = validatePresentationTitle(draft)
    
    if (!validation.isValid) {
      setError(validation.error || "Invalid title")
      return
    }
    
    onTitleChange(validation.sanitized)
    setIsEditing(false)
    setError(null)
  }

  return (
    <header className="flex h-14 sm:h-16 items-center bg-white px-3 sm:px-4 lg:px-6 border-b border-gray-200">
      <div className="flex items-center flex-1">
        <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3 mr-4 sm:mr-6 lg:mr-8">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg bg-blue-600">
            <PresentationIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-light tracking-wide text-gray-900 hidden lg:block">PRESENTPRO</span>
        </Link>

        <div className="flex-1 flex justify-center">
        {isEditing ? (
          <div className="relative">
            <div className="flex items-center space-x-2">
              <Input
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value)
                  setError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle()
                  if (e.key === "Escape") {
                    setDraft(title)
                    setIsEditing(false)
                    setError(null)
                  }
                }}
                className={`h-8 sm:h-9 lg:h-10 w-48 sm:w-64 lg:w-72 bg-gray-50 border-gray-200 text-center text-sm sm:text-base font-medium rounded-lg ${
                  error ? "border-red-500 focus:border-red-500" : ""
                }`}
                autoFocus
              />
              <Button size="icon" variant="ghost" onClick={saveTitle} className="h-7 w-7 sm:h-8 sm:w-8">
                <Check className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setDraft(title)
                  setIsEditing(false)
                  setError(null)
                }}
                className="h-7 w-7 sm:h-8 sm:w-8"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            {error && (
              <p className="absolute top-full left-0 mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        ) : (
          <button
            className="group flex items-center space-x-2 sm:space-x-3 rounded-lg px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 hover:bg-gray-100 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <span className="text-sm sm:text-base font-medium text-gray-900 truncate max-w-[200px] sm:max-w-[300px] lg:max-w-none">{title}</span>
            <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 flex-shrink-0" />
          </button>
        )}
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onVersionHistory}
          className="hidden sm:flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 sm:px-3 py-1 sm:py-1.5 rounded-md hover:bg-gray-100"
          title="View version history"
        >
          <Clock className={`h-3 w-3 sm:h-4 sm:w-4 ${isAutoSaving ? "animate-spin" : ""}`} />
          <span className="hidden md:inline">{isAutoSaving ? "Saving…" : "Version history"}</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="h-8 sm:h-9 lg:h-10 bg-gray-900 hover:bg-gray-800 px-3 sm:px-4 lg:px-6 text-xs sm:text-sm">
              <Share2 className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" /> Share presentation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onVersionHistory}>
              <History className="mr-2 h-4 w-4" /> Version history
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" /> Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" /> Export as PowerPoint
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" /> Duplicate presentation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserDropdown showUpgrade={false} />
      </div>
    </header>
  )
}