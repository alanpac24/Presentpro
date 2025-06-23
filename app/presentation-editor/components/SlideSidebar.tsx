"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Sparkles, Layers } from "lucide-react"

interface SlideSidebarProps {
  currentSlide: any
  selectedElement: string | null
  onSlideUpdate: (slideId: number, updates: any) => void
}

const slideTypes = {
  title: "Title Slide",
  content: "Content Slide",
  chart: "Chart & Data",
  strategy: "Go-to-Market",
  timeline: "Timeline",
  comparison: "Comparison",
  conclusion: "Conclusion",
}

const slideCategories = {
  Structure: ["title", "content", "conclusion"],
  Business: ["strategy", "comparison"],
  Data: ["chart", "timeline"],
}

const mockChatHistory = [
  { id: 1, type: "user", message: "Make the title more engaging", timestamp: "2 min ago" },
  { id: 2, type: "ai", message: "I've updated the title to be more compelling.", timestamp: "2 min ago" },
  { id: 3, type: "user", message: "Add more bullet points about market trends", timestamp: "5 min ago" },
]

export function SlideSidebar({ currentSlide, selectedElement, onSlideUpdate }: SlideSidebarProps) {
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState(mockChatHistory)

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    const newMessage = { id: Date.now(), type: "user" as const, message: chatMessage, timestamp: "now" }
    setChatHistory((prev) => [newMessage, ...prev])
    setChatMessage("")
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai" as const,
        message: "Updated based on your request.",
        timestamp: "now",
      }
      setChatHistory((prev) => [aiResponse, ...prev])
    }, 1000)
  }

  const getPlaceholderText = () => {
    if (selectedElement) return `Edit ${selectedElement}...`
    return "Ask me anything about this slide..."
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 space-y-6">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-900 flex items-center">
              <Layers className="w-4 h-4 mr-2 text-gray-600" />
              Slide Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={currentSlide.type}
              onValueChange={(value) => onSlideUpdate(currentSlide.id, { type: value })}
            >
              <SelectTrigger className="w-full h-11 bg-gray-50 border-gray-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(slideCategories).map(([category, types]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">{category}</div>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {slideTypes[type as keyof typeof slideTypes]}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-6">
        <Card className="flex-1 flex flex-col bg-white border border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-900 flex items-center">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center mr-2">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              AI Assistant
              {selectedElement && <span className="ml-2 text-xs text-gray-500 font-normal">/ {selectedElement}</span>}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-4">
                {chatHistory.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${message.type === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
                    >
                      <p className="leading-relaxed">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={getPlaceholderText()}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 h-11 bg-gray-50 border-gray-200 rounded-lg"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                  size="icon"
                  className="h-11 w-11 bg-gray-900 hover:bg-gray-800 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}