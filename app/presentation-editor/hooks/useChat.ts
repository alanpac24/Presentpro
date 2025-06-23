import { useState } from "react"

interface ChatMessage {
  id: number
  type: "user" | "ai"
  message: string
  timestamp: string
}

interface UseChatProps {
  selectedElement?: string | null
  onAIResponse?: (message: string) => void
}

const mockChatHistory: ChatMessage[] = [
  { id: 1, type: "user", message: "Make the title more engaging", timestamp: "2 min ago" },
  { id: 2, type: "ai", message: "I've updated the title to be more compelling.", timestamp: "2 min ago" },
  { id: 3, type: "user", message: "Add more bullet points about market trends", timestamp: "5 min ago" },
]

export function useChat({ selectedElement, onAIResponse }: UseChatProps = {}) {
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(mockChatHistory)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      message: chatMessage,
      timestamp: "now",
    }
    
    setChatHistory((prev) => [newMessage, ...prev])
    setChatMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        type: "ai",
        message: "Updated based on your request.",
        timestamp: "now",
      }
      setChatHistory((prev) => [aiResponse, ...prev])
      setIsLoading(false)
      
      if (onAIResponse) {
        onAIResponse(aiResponse.message)
      }
    }, 1000)
  }

  const getPlaceholderText = () => {
    if (selectedElement) return `Edit ${selectedElement}...`
    return "Ask me anything about this slide..."
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return {
    chatMessage,
    setChatMessage,
    chatHistory,
    isLoading,
    handleSendMessage,
    handleKeyDown,
    getPlaceholderText,
  }
}