"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, Cloud, Share2, FileDown, Database, Lock, 
  Zap, CheckCircle, ExternalLink
} from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import Image from "next/image"

const integrations = [
  {
    name: "Microsoft PowerPoint",
    description: "Direct export to PowerPoint format with perfect formatting and animations",
    category: "Export",
    icon: FileDown,
    color: "orange",
    status: "active",
    features: ["One-click export", "Preserve animations", "Custom templates"]
  },
  {
    name: "Google Workspace",
    description: "Seamlessly integrate with Google Slides and Drive for cloud collaboration",
    category: "Collaboration",
    icon: Cloud,
    color: "blue",
    status: "active",
    features: ["Auto-sync", "Real-time collaboration", "Version control"]
  },
  {
    name: "Slack",
    description: "Share presentations and get feedback directly in your Slack channels",
    category: "Communication",
    icon: Share2,
    color: "purple",
    status: "active",
    features: ["Share previews", "Comments sync", "Notifications"]
  },
  {
    name: "Salesforce",
    description: "Pull CRM data directly into your sales presentations",
    category: "CRM",
    icon: Database,
    color: "blue",
    status: "active",
    features: ["Data sync", "Dynamic updates", "Custom fields"]
  },
  {
    name: "Microsoft Teams",
    description: "Present directly in Teams meetings with interactive features",
    category: "Communication",
    icon: Share2,
    color: "indigo",
    status: "coming-soon",
    features: ["Live presenting", "Audience interaction", "Recording"]
  },
  {
    name: "SSO/SAML",
    description: "Enterprise single sign-on for secure team access",
    category: "Security",
    icon: Lock,
    color: "green",
    status: "active",
    features: ["SAML 2.0", "OAuth", "Custom domains"]
  }
]

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Zap className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-light text-gray-900 mb-4">Integrations</h1>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Connect PresentPro with your favorite tools to streamline your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {integrations.map((integration) => {
            const Icon = integration.icon
            return (
              <Card key={integration.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${integration.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${integration.color}-600`} />
                  </div>
                  <Badge 
                    variant={integration.status === "active" ? "default" : "secondary"}
                    className={integration.status === "active" ? "bg-green-100 text-green-700" : ""}
                  >
                    {integration.status === "active" ? "Active" : "Coming Soon"}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">{integration.name}</h3>
                <p className="text-gray-600 mb-4">{integration.description}</p>
                
                <div className="space-y-2 mb-6">
                  {integration.features.map((feature) => (
                    <div key={feature} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full ${
                    integration.status === "active" 
                      ? "bg-gray-900 hover:bg-gray-800 text-white" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={integration.status !== "active"}
                >
                  {integration.status === "active" ? (
                    <>
                      Configure
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "Coming Soon"
                  )}
                </Button>
              </Card>
            )
          })}
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 rounded-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-4">Need a Custom Integration?</h2>
            <p className="text-xl mb-8 opacity-90">
              Our API allows you to build custom integrations with any platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/api-access">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  View API Docs
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}