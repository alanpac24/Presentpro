"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Clock, RotateCcw, Eye, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Version {
  id: string
  timestamp: Date
  label?: string
  changes: string
  isCurrentVersion?: boolean
}

interface VersionHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  presentationTitle: string
  versions: Version[]
  onRestore: (versionId: string) => void
  onPreview: (versionId: string) => void
}

const mockVersions: Version[] = [
  {
    id: "v1",
    timestamp: new Date(),
    isCurrentVersion: true,
    changes: "Current version"
  },
  {
    id: "v2",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    changes: "Updated revenue slides and market analysis"
  },
  {
    id: "v3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    changes: "Added new financial charts and timeline"
  },
  {
    id: "v4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    changes: "Initial draft with executive summary"
  },
]

export function VersionHistoryModal({
  open,
  onOpenChange,
  presentationTitle,
  versions = mockVersions,
  onRestore,
  onPreview,
}: VersionHistoryModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            View and restore previous versions of "{presentationTitle}"
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-3">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`rounded-lg border p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedVersion === version.id ? "border-blue-500 bg-blue-50" : ""
                } ${version.isCurrentVersion ? "border-green-500 bg-green-50" : ""}`}
                onClick={() => setSelectedVersion(version.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        {format(version.timestamp, "MMM d, yyyy 'at' h:mm a")}
                      </span>
                      {version.isCurrentVersion && (
                        <Badge variant="default" className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Current version
                        </Badge>
                      )}
                      {version.label && (
                        <Badge variant="secondary">{version.label}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{version.changes}</p>
                  </div>
                  
                  {!version.isCurrentVersion && (
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          onPreview(version.id)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRestore(version.id)
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-500">
            Version history is automatically saved when you make changes
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}