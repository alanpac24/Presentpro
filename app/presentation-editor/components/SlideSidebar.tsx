"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles, Layers } from "lucide-react"
import { useChat } from "../hooks/useChat"

interface SlideSidebarProps {
  currentSlide: any
  selectedElement: string | null
  onSlideUpdate: (slideId: number, updates: any) => void
  width?: number
  onResizeStart?: () => void
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

export function SlideSidebar({ 
  currentSlide, 
  selectedElement, 
  onSlideUpdate, 
  width = 560, 
  onResizeStart
}: SlideSidebarProps) {
  const {
    chatMessage,
    setChatMessage,
    chatHistory,
    isLoading,
    handleSendMessage,
    handleKeyDown,
    getPlaceholderText,
  } = useChat({ selectedElement })

  return (
    <div 
      className="bg-white flex flex-col h-full relative z-10 w-full"
    >
      {/* Resize handle */}
      <div
        className="absolute -right-3 top-0 bottom-0 w-6 cursor-col-resize z-50 group flex items-center justify-center"
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onResizeStart?.()
        }}
      >
        {/* Make it more visible for debugging */}
        <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
        <div className="w-1 h-full bg-gray-300 group-hover:bg-blue-500 transition-colors duration-200" />
      </div>
      {/* Slide Type Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <Layers className="w-4 h-4 mr-2 text-gray-600" />
          <h3 className="text-base font-medium text-gray-900">Slide Type</h3>
        </div>
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
      </div>

      {/* AI Assistant Section - Fills remaining height */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex items-center p-6 pb-3">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center mr-2">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-base font-medium text-gray-900">AI Assistant</h3>
          {selectedElement && <span className="ml-2 text-xs text-gray-500 font-normal">/ {selectedElement}</span>}
        </div>

        {/* Chat History - Extends to bottom minus input height */}
        <div className="flex-1 overflow-hidden pb-[150px]">
          <ScrollArea className="h-full px-6">
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
        </div>

        {/* Enhanced Chat Input - Absolutely positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-3 border-t border-gray-200 bg-white z-20">
          <div className="space-y-2">
            <Textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={getPlaceholderText()}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] resize-none bg-gray-50 border-gray-200 rounded-lg p-3 text-sm"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!chatMessage.trim() || isLoading}
              className="w-full h-10 bg-gray-900 hover:bg-gray-800"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}