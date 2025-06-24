"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HelpCircle, Mail, Book, FileText, Search, Clock, Zap, AlertCircle } from "lucide-react"
import { PrivateHeader } from "@/components/header"
import Link from "next/link"

const faqs = [
  {
    q: "How do I create my first presentation?",
    a: "Click the 'Create Presentation' button on your dashboard. Enter your topic and audience, then our AI will generate a complete presentation. You can edit and customize it in the presentation editor.",
  },
  {
    q: "What's the difference between the plans?",
    a: "Free plan includes 3 presentations/month with basic templates. Pro (10/month) adds PowerPoint export. Professional (50/month) includes premium templates, AI chat assistance, and custom branding.",
  },
  {
    q: "How do I export my presentation?",
    a: "In the presentation editor, click the Share button and select your export format. Free users can export to PDF, while Pro and Professional users can also export to PowerPoint.",
  },
  {
    q: "Can I upload my own PowerPoint files?",
    a: "This feature is coming soon! We're working on allowing you to upload existing PowerPoint files for AI-powered enhancement and editing.",
  },
  {
    q: "How does the AI understand my brand?",
    a: "Professional users can set brand guidelines including colors, fonts, and logos in Settings. The AI will automatically apply these to all your presentations.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use industry-standard encryption for all data transmission and storage. Your presentations are private and only accessible to you.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel or change your plan anytime from the Settings page. If you cancel, you'll keep access until the end of your billing period.",
  },
  {
    q: "What if I need more presentations than my plan allows?",
    a: "You can upgrade your plan anytime, or wait for your monthly limit to reset. We're also working on pay-as-you-go options for occasional extra needs.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee for new subscriptions. If you're not satisfied, contact us within 7 days of purchase for a full refund.",
  },
  {
    q: "How long does support take to respond?",
    a: "We typically respond to emails within 24-48 hours on business days. As a small team, we appreciate your patience and always strive to help as quickly as possible.",
  }
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
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions or reach out for help
            </p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
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

            <div className="space-y-6">
              {/* Support Notice */}
              <Card className="bg-amber-50 border border-amber-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <CardTitle className="text-lg font-medium text-amber-900">Support Hours</CardTitle>
                      <CardDescription className="text-amber-700 mt-1">
                        We're a small team working hard to help you. Email responses typically within 24-48 hours on weekdays.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Contact Support */}
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Get Help</CardTitle>
                  <CardDescription>
                    Choose the best way to get assistance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="mailto:support@presentpro.ai" className="block">
                    <Button variant="outline" className="w-full justify-start h-12 hover:bg-gray-50">
                      <Mail className="w-5 h-5 mr-3 text-gray-600" />
                      <div className="text-left">
                        <div className="font-medium">Email Support</div>
                        <div className="text-xs text-gray-500">support@presentpro.ai</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-3">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      For faster help, please include:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-5">
                      <li>• Your account email</li>
                      <li>• Description of the issue</li>
                      <li>• Screenshots if applicable</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Self-Service Resources */}
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Quick Resources</CardTitle>
                  <CardDescription>
                    Self-service guides and tutorials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard" className="block">
                    <Button variant="outline" className="w-full justify-start h-12 hover:bg-gray-50">
                      <Zap className="w-5 h-5 mr-3 text-gray-600" />
                      <div className="text-left">
                        <div className="font-medium">Getting Started</div>
                        <div className="text-xs text-gray-500">Create your first presentation</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/templates" className="block">
                    <Button variant="outline" className="w-full justify-start h-12 hover:bg-gray-50">
                      <Book className="w-5 h-5 mr-3 text-gray-600" />
                      <div className="text-left">
                        <div className="font-medium">Browse Templates</div>
                        <div className="text-xs text-gray-500">Find the perfect starting point</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/upgrade" className="block">
                    <Button variant="outline" className="w-full justify-start h-12 hover:bg-gray-50">
                      <FileText className="w-5 h-5 mr-3 text-gray-600" />
                      <div className="text-left">
                        <div className="font-medium">Compare Plans</div>
                        <div className="text-xs text-gray-500">Find the right plan for you</div>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Card className="bg-gray-50 border border-gray-200 inline-block">
              <CardContent className="p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Still need help?</h3>
                <p className="text-gray-600 mb-6">
                  We're here to assist you. Send us an email and we'll get back to you soon.
                </p>
                <Link href="mailto:support@presentpro.ai">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}