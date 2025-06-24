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

interface PresentationEditorHeaderProps {
  title: string
  onTitleChange: (title: string) => void
  isAutoSaving: boolean
  onVersionHistory?: () => void
}

export function PresentationEditorHeader({ title, onTitleChange, isAutoSaving, onVersionHistory }: PresentationEditorHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(title)

  const saveTitle = () => {
    onTitleChange(draft.trim() || "Untitled presentation")
    setIsEditing(false)
  }

  return (
    <header className="flex h-16 items-center bg-white px-6 border-b border-gray-200">
      <div className="flex items-center flex-1">
        <Link href="/dashboard" className="flex items-center space-x-3 mr-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <PresentationIcon className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-light tracking-wide text-gray-900 hidden lg:block">PRESENTPRO</span>
        </Link>

        <div className="flex-1 flex justify-center">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle()
                if (e.key === "Escape") setIsEditing(false)
              }}
              className="h-10 w-72 bg-gray-50 border-gray-200 text-center text-base font-medium rounded-lg"
              autoFocus
            />
            <Button size="icon" variant="ghost" onClick={saveTitle}>
              <Check className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setDraft(title)
                setIsEditing(false)
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <button
            className="group flex items-center space-x-3 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <span className="text-base font-medium text-gray-900">{title}</span>
            <Edit3 className="h-4 w-4 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onVersionHistory}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100"
          title="View version history"
        >
          <Clock className={`h-4 w-4 ${isAutoSaving ? "animate-spin" : ""}`} />
          <span>{isAutoSaving ? "Saving…" : "Version history"}</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="h-10 bg-gray-900 hover:bg-gray-800 px-6">
              <Share2 className="mr-2 h-4 w-4" />
              Share
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