"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, MessageCircle, Book, Video, Mail, Users, Search } from "lucide-react"
import { PrivateHeader } from "@/components/header"

const faqs = [
  {
    q: "How do I create my first presentation?",
    a: "Click the 'Create Presentation' button on your dashboard. You can start from scratch or choose a template. Our AI assistant will guide you.",
  },
  {
    q: "Can I collaborate with my team?",
    a: "Yes! Professional and Enterprise plans include team collaboration. Invite members to edit in real-time and leave comments.",
  },
  {
    q: "What export formats are supported?",
    a: "We support PowerPoint (PPTX), PDF, and PNG images. Professional and Enterprise users get access to more formats.",
  },
  {
    q: "How does the AI generator work?",
    a: "Our AI analyzes your input (topic, audience) and generates a complete presentation with relevant content, design, and visuals.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use enterprise-grade security including end-to-end encryption and secure cloud storage.",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      <main className="bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-5xl font-light text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Find answers, browse resources, or get in touch.</p>
          </div>

          <div className="mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for answers..."
                className="w-full h-14 pl-12 text-lg bg-white border-gray-200 rounded-lg shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-medium text-gray-900 mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white border border-gray-200 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-lg font-medium text-left hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-gray-700 pt-2 pb-4">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFaqs.length === 0 && <p className="text-gray-600 mt-6">No results found for "{searchQuery}".</p>}
            </div>

            <div className="space-y-8">
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Contact Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <MessageCircle className="w-5 h-5 mr-3 text-gray-600" />
                    Live Chat
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Mail className="w-5 h-5 mr-3 text-gray-600" />
                    Email Support
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Book className="w-5 h-5 mr-3 text-gray-600" />
                    User Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Video className="w-5 h-5 mr-3 text-gray-600" />
                    Video Tutorials
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Users className="w-5 h-5 mr-3 text-gray-600" />
                    Community Forum
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}