"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Loader2, Layers } from "lucide-react"
import { parseIntent, generateResponse, generateSampleContent } from "@/lib/simple-ai-utils"

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

export function AIAssistant({ 
  currentSlide, 
  elements, 
  onAction, 
  width, 
  onResizeStart, 
  onSlideUpdate 
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hi! I can help you add, update, or delete slide elements. Try "Add title saying Q4 Results" or "Add bullet points".',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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

    try {
      // Simple pattern-based processing
      const intent = parseIntent(input)
      const response = generateResponse(intent)

      // Execute action if valid
      if (intent.action === 'add' && intent.target && intent.content) {
        const content = intent.content || generateSampleContent(intent.target)
        
        onAction({
          type: 'add_element',
          elementType: intent.target,
          content: content,
          position: { x: 100, y: 100 },
          size: intent.target === 'title' 
            ? { width: 600, height: 60 }
            : { width: 400, height: 100 }
        })
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="flex flex-col h-full bg-gray-50 border-l"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <h3 className="font-semibold">AI Assistant</h3>
        <p className="text-sm text-gray-600">Ask me to add or modify slide content</p>
      </div>

      {/* Slide Type Selector */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center mb-2">
          <Layers className="w-4 h-4 mr-2 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Change Slide Type</span>
        </div>
        <Select
          value={currentSlide.type}
          onValueChange={(value) => onSlideUpdate(currentSlide.id, { type: value })}
        >
          <SelectTrigger className="w-full bg-white">
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

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg px-4 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to add content..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}