"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Scale, AlertCircle, Shield, Users, CreditCard, ArrowLeft } from "lucide-react"
import { PublicHeader } from "@/components/public-header"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-light text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 font-light">Effective Date: January 1, 2024</p>
        </div>

        <Card className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
                <Scale className="w-6 h-6 mr-3 text-blue-600" />
                Agreement to Terms
              </h2>
              <p className="text-gray-600 mb-4">
                By accessing or using PresentPro, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, 
                you are prohibited from using or accessing this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-blue-600" />
                Use License
              </h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to use PresentPro for personal and commercial purposes, subject to the following restrictions:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>You must not modify or copy our proprietary materials</li>
                <li>You must not use materials for any commercial purpose without permission</li>
                <li>You must not attempt to reverse engineer any software</li>
                <li>You must not remove any copyright or proprietary notations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-blue-600" />
                User Responsibilities
              </h2>
              <p className="text-gray-600 mb-4">
                As a user of PresentPro, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not use the service for illegal or unauthorized purposes</li>
                <li>Not violate any laws in your jurisdiction</li>
                <li>Not upload content that infringes on intellectual property rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                Subscription and Billing
              </h2>
              <p className="text-gray-600 mb-4">
                Paid features of PresentPro are billed in advance on a subscription basis:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Subscription fees are non-refundable</li>
                <li>Prices may change with 30 days notice</li>
                <li>You can cancel your subscription at any time</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Content and Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                You retain all rights to the content you create using PresentPro. However, by using our service, 
                you grant us a license to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Store and process your content to provide the service</li>
                <li>Generate AI-powered suggestions and improvements</li>
                <li>Create anonymized data for service improvement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-3 text-blue-600" />
                Disclaimer and Limitations
              </h2>
              <p className="text-gray-600 mb-4">
                PresentPro is provided "as is" without any warranties, expressed or implied. We do not warrant that:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>The service will be uninterrupted or error-free</li>
                <li>Results obtained will be accurate or reliable</li>
                <li>The service will meet your specific requirements</li>
              </ul>
              <p className="text-gray-600 mt-4">
                In no event shall PresentPro be liable for any indirect, incidental, special, 
                consequential, or punitive damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes via email or through the service. Your continued use constitutes 
                acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email: legal@presentpro.ai<br />
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