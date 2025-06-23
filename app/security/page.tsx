"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, Shield, Lock, Key, Eye, Server, Cloud, 
  CheckCircle, Award, FileCheck, AlertTriangle
} from "lucide-react"
import { PublicHeader } from "@/components/public-header"

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-light text-gray-900 mb-4">Enterprise Security</h1>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Bank-grade security and compliance to protect your business data
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Lock className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">End-to-End Encryption</h3>
            <p className="text-gray-600 mb-4">
              All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption
            </p>
            <Badge variant="secondary" className="text-xs">256-bit encryption</Badge>
          </Card>

          <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Key className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Controls</h3>
            <p className="text-gray-600 mb-4">
              Role-based access control with granular permissions and audit trails
            </p>
            <Badge variant="secondary" className="text-xs">RBAC enabled</Badge>
          </Card>

          <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Eye className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy by Design</h3>
            <p className="text-gray-600 mb-4">
              Your data is never used for training AI models or shared with third parties
            </p>
            <Badge variant="secondary" className="text-xs">Zero data sharing</Badge>
          </Card>

          <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Server className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Infrastructure</h3>
            <p className="text-gray-600 mb-4">
              Hosted on AWS with multiple availability zones and automatic failover
            </p>
            <Badge variant="secondary" className="text-xs">99.99% uptime</Badge>
          </Card>

          <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Cloud className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Data Residency</h3>
            <p className="text-gray-600 mb-4">
              Choose where your data is stored with options in US, EU, and APAC regions
            </p>
            <Badge variant="secondary" className="text-xs">Multi-region</Badge>
          </Card>

          <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <AlertTriangle className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Threat Detection</h3>
            <p className="text-gray-600 mb-4">
              Real-time monitoring and anomaly detection to prevent unauthorized access
            </p>
            <Badge variant="secondary" className="text-xs">24/7 monitoring</Badge>
          </Card>
        </div>

        {/* Compliance Section */}
        <Card className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 mb-16">
          <div className="text-center mb-10">
            <Award className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-light text-gray-900 mb-4">Compliance & Certifications</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We maintain the highest standards of compliance to meet your regulatory requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-10 h-10 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">SOC 2 Type II</h3>
              <p className="text-sm text-gray-600">Annual audit</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">ISO 27001</h3>
              <p className="text-sm text-gray-600">Certified</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">GDPR</h3>
              <p className="text-sm text-gray-600">Compliant</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">HIPAA</h3>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </div>
        </Card>

        {/* Security Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">Security Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">For Your Team</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-600">Enable two-factor authentication for all users</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-600">Use strong, unique passwords for each account</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-600">Regularly review and update access permissions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-600">Train employees on security awareness</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Our Commitment</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-600">Regular security audits and penetration testing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-600">Immediate notification of any security incidents</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-600">Continuous monitoring and threat detection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-600">Regular updates and security patches</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-12 rounded-xl text-center">
          <h2 className="text-3xl font-light mb-4">Have Security Questions?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our security team is here to help you understand how we protect your data
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-gray-900 hover:bg-gray-100">
                Contact Security Team
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Download Security Whitepaper
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}