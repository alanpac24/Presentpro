"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Lock, Eye, UserCheck, Server, Globe, ArrowLeft } from "lucide-react"
import { PublicHeader } from "@/components/public-header"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-light text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 font-light">Last updated: January 1, 2024</p>
        </div>

        <Card className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-blue-600" />
                Information We Collect
              </h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                create presentations, or contact us for support. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Name and email address</li>
                <li>Company information</li>
                <li>Presentation content and data</li>
                <li>Usage information and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-blue-600" />
                How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide and improve our services</li>
                <li>Process your presentations with AI</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to improve our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-blue-600" />
                Information Sharing
              </h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information in certain situations:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who assist in our operations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
                <Server className="w-6 h-6 mr-3 text-blue-600" />
                Data Security
              </h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction. 
                This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Limited access to personal information</li>
                <li>Secure data centers with 24/7 monitoring</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-3 text-blue-600" />
                International Data Transfers
              </h2>
              <p className="text-gray-600 mb-4">
                Your information may be transferred to and processed in countries other than 
                your country of residence. We ensure appropriate safeguards are in place to 
                protect your information in accordance with this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email: privacy@presentpro.ai<br />
                Address: 123 AI Street, San Francisco, CA 94105
              </p>
            </section>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="px-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}