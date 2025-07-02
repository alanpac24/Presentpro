"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Loader2, Layers } from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  currentSlide: any
  elements: any[]
  onAction: (action: any) => void
  width: number
  onResizeStart: () => void
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

export function AIAssistant({ currentSlide, elements, onAction, width, onResizeStart, onSlideUpdate }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [processingMessage, setProcessingMessage] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setProcessingMessage(input)

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          currentSlide,
          elements
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])

      // Execute actions
      if (data.actions && data.actions.length > 0) {
        data.actions.forEach((action: any) => {
          onAction(action)
        })
      }
    } catch (error) {
      // Log error - in production, send to error tracking service
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setProcessingMessage(null)
    }
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col relative">
      {/* Resize Handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1 hover:w-2 cursor-col-resize bg-transparent hover:bg-blue-500 transition-all z-10"
        onMouseDown={onResizeStart}
      />
      
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-base font-semibold">AI Assistant</h2>
        </div>
        
        {/* Slide Type Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center mb-3">
            <Layers className="w-4 h-4 mr-2 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">Slide Type</h3>
          </div>
          <Select
            value={currentSlide.type}
            onValueChange={(value) => onSlideUpdate(currentSlide.id, { type: value })}
          >
            <SelectTrigger className="w-full h-10 bg-gray-50 border-gray-200 rounded-lg text-sm">
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
        
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 px-6 py-8">
              <p className="text-sm text-gray-700 leading-relaxed">
                Hi! I can help you create and edit your presentation. Try asking me to:
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
                <li>• Add a title or text</li>
                <li>• Create a chart</li>
                <li>• Insert a table</li>
                <li>• Add shapes</li>
                <li>• Format elements</li>
              </ul>
              <div className="text-xs text-gray-400 mt-4">00:05</div>
            </div>
          ) : (
            <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    {message.role === 'user' ? (
                      <div className="inline-block max-w-[85%]">
                        <div className="bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm">
                          {message.content}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ) : (
                      <div className="inline-block max-w-[85%]">
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2.5 text-sm">
                          {message.content}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && processingMessage && (
                  <div className="text-left">
                    <div className="inline-block max-w-[85%]">
                      <div className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2.5 text-sm italic">
                        {processingMessage === "chang text to ai" 
                          ? "Updating the content text to 'AI Overview' and adjusting the content accordingly."
                          : "Processing your request..."}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">00:06</div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2 items-center">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask me to create or edit slides..."
              className="flex-1 h-10 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Powered by GPT-4
          </p>
        </div>
      </div>
    </div>
  )
}