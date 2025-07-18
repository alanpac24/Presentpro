import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { pdf } from '@react-pdf/renderer'
import { researchService } from '@/lib/services/research-service'
import { aiService } from '@/lib/services/ai-service'
import ProposalDocument from '@/components/pdf/ProposalDocument'
import React from 'react'

// Request validation schema
const GenerateProposalSchema = z.object({
  companyName: z.string().min(1),
  companyWebsite: z.string().url().optional(),
  contactName: z.string().min(1),
  contactTitle: z.string().min(1),
  contactEmail: z.string().email(),
  linkedinUrl: z.string().url().optional(),
  productDescription: z.string().min(1),
  salesObjective: z.enum(['demo', 'pilot', 'close', 'discovery', 'renewal']),
  yourName: z.string().min(1),
  yourEmail: z.string().email(),
  yourCompany: z.string().min(1),
})

export type GenerateProposalRequest = z.infer<typeof GenerateProposalSchema>

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate request
    const validatedData = GenerateProposalSchema.parse(body)
    
    // Step 1: Research company and prospect
    console.log('Starting research phase...')
    const research = await researchService.performResearch(
      validatedData.companyName,
      validatedData.companyWebsite,
      validatedData.contactName,
      validatedData.contactTitle,
      validatedData.linkedinUrl
    )
    
    // Step 2: Generate AI content
    console.log('Generating AI content...')
    const proposalContent = await aiService.generateProposalContent(research, {
      product: validatedData.productDescription,
      objective: validatedData.salesObjective,
      companyInfo: {
        name: validatedData.yourCompany,
        contactName: validatedData.yourName,
        contactEmail: validatedData.yourEmail,
      }
    })
    
    // Step 3: Generate PDF
    console.log('Creating PDF document...')
    const pdfDoc = React.createElement(ProposalDocument, {
      content: proposalContent,
      companyName: validatedData.companyName,
      contactName: validatedData.yourName,
      contactEmail: validatedData.yourEmail,
    })
    
    const pdfBlob = await pdf(pdfDoc as any).toBlob()
    const pdfBuffer = await pdfBlob.arrayBuffer()
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')
    
    // Step 4: Generate email content
    const emailSubject = await aiService.generateEmailSubject(
      validatedData.companyName,
      validatedData.salesObjective
    )
    
    const emailBody = await aiService.generateEmailBody(
      validatedData.contactName,
      validatedData.companyName,
      proposalContent.executiveSummary.mainContent[0].content,
      validatedData.yourName
    )
    
    // Return the generated content
    return NextResponse.json({
      success: true,
      data: {
        research,
        proposalContent,
        pdf: {
          base64: pdfBase64,
          filename: `${validatedData.companyName.replace(/\s+/g, '_')}_Proposal.pdf`
        },
        email: {
          subject: emailSubject,
          body: emailBody,
          to: validatedData.contactEmail,
          from: validatedData.yourEmail
        }
      }
    })
  } catch (error) {
    console.error('Proposal generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data', 
          details: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate proposal' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check service status
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'proposal-generator',
    version: '1.0.0',
    features: {
      research: true,
      aiGeneration: true,
      pdfCreation: true,
      emailDrafting: true
    }
  })
}