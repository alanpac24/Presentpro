"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, Code2, Key, Zap, Globe, Shield, Copy, Check,
  Terminal, FileCode, Database, Lock
} from "lucide-react"
import { PublicHeader } from "@/components/public-header"

export default function APIAccessPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const codeExamples = {
    curl: `curl -X POST https://api.presentpro.ai/v1/presentations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Q4 Business Review",
    "template": "business-review",
    "slides": 25,
    "data": {
      "company": "Acme Corp",
      "quarter": "Q4 2024"
    }
  }'`,
    python: `import requests

api_key = "YOUR_API_KEY"
url = "https://api.presentpro.ai/v1/presentations"

data = {
    "title": "Q4 Business Review",
    "template": "business-review",
    "slides": 25,
    "data": {
        "company": "Acme Corp",
        "quarter": "Q4 2024"
    }
}

response = requests.post(url, 
    headers={"Authorization": f"Bearer {api_key}"},
    json=data
)

print(response.json())`,
    javascript: `const apiKey = 'YOUR_API_KEY';
const url = 'https://api.presentpro.ai/v1/presentations';

const data = {
  title: 'Q4 Business Review',
  template: 'business-review',
  slides: 25,
  data: {
    company: 'Acme Corp',
    quarter: 'Q4 2024'
  }
};

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
  // Handle the response data
  // Example: Update UI, store in state, etc.
  return data;
})
.catch(error => {
  // Handle errors appropriately
  console.error('Error:', error);
});`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Code2 className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-light text-gray-900 mb-4">API Access</h1>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Build custom integrations and automate presentation creation with our powerful API
          </p>
        </div>

        {/* API Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="p-6">
              <Zap className="w-10 h-10 text-blue-600 mb-4" />
              <CardTitle className="text-lg">RESTful API</CardTitle>
              <CardDescription>
                Simple, intuitive endpoints for all presentation operations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="p-6">
              <Globe className="w-10 h-10 text-blue-600 mb-4" />
              <CardTitle className="text-lg">Global CDN</CardTitle>
              <CardDescription>
                Low-latency access from anywhere in the world
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="p-6">
              <Shield className="w-10 h-10 text-blue-600 mb-4" />
              <CardTitle className="text-lg">Secure</CardTitle>
              <CardDescription>
                OAuth 2.0 authentication and encrypted connections
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="p-6">
              <Database className="w-10 h-10 text-blue-600 mb-4" />
              <CardTitle className="text-lg">Webhooks</CardTitle>
              <CardDescription>
                Real-time notifications for presentation events
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Code Examples */}
        <Card className="bg-white border border-gray-200 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-light">Quick Start</CardTitle>
            <CardDescription className="text-lg">
              Get started with our API in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              </TabsList>
              
              {Object.entries(codeExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang} className="mt-6">
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                      <code className="text-sm">{code}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(code, lang)}
                    >
                      {copiedCode === lang ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card className="bg-white border border-gray-200 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-light">API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-green-100 text-green-700">POST</Badge>
                    <code className="text-sm font-mono">/v1/presentations</code>
                  </div>
                  <span className="text-sm text-gray-600">Create presentation</span>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-blue-100 text-blue-700">GET</Badge>
                    <code className="text-sm font-mono">/v1/presentations/:id</code>
                  </div>
                  <span className="text-sm text-gray-600">Get presentation</span>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-yellow-100 text-yellow-700">PUT</Badge>
                    <code className="text-sm font-mono">/v1/presentations/:id</code>
                  </div>
                  <span className="text-sm text-gray-600">Update presentation</span>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-red-100 text-red-700">DELETE</Badge>
                    <code className="text-sm font-mono">/v1/presentations/:id</code>
                  </div>
                  <span className="text-sm text-gray-600">Delete presentation</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-blue-100 text-blue-700">GET</Badge>
                    <code className="text-sm font-mono">/v1/templates</code>
                  </div>
                  <span className="text-sm text-gray-600">List templates</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <CardContent className="p-12 text-center">
            <Key className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-light mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get your API key and start building amazing integrations today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  Get API Key
                </Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <FileCode className="w-4 h-4 mr-2" />
                View Full Docs
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}