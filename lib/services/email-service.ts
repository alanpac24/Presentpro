import { Resend } from 'resend'

export interface EmailOptions {
  to: string
  subject: string
  body: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
  }>
  from?: string
  replyTo?: string
}

export class EmailService {
  private resend: Resend | null = null
  private fromEmail: string
  private fromName: string

  constructor() {
    // Initialize Resend if API key is available
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key') {
      this.resend = new Resend(process.env.RESEND_API_KEY)
    }
    
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'proposals@salespro.ai'
    this.fromName = process.env.RESEND_FROM_NAME || 'SalesPro'
  }

  /**
   * Send proposal email with PDF attachment
   */
  async sendProposalEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // If Resend is not configured, return mock success
      if (!this.resend) {
        console.log('Email service not configured. Mock sending email:', {
          to: options.to,
          subject: options.subject,
          attachments: options.attachments?.length || 0
        })
        return { 
          success: true, 
          messageId: `mock-${Date.now()}` 
        }
      }

      // Prepare email HTML
      const html = this.formatEmailHtml(options.body)

      // Send email via Resend
      const { data, error } = await this.resend.emails.send({
        from: `${this.fromName} <${options.from || this.fromEmail}>`,
        to: [options.to],
        subject: options.subject,
        html,
        text: options.body, // Plain text fallback
        attachments: options.attachments,
        replyTo: options.replyTo
      })

      if (error) {
        throw error
      }

      return { 
        success: true, 
        messageId: data?.id 
      }
    } catch (error) {
      console.error('Email sending error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      }
    }
  }

  /**
   * Format plain text email body to HTML
   */
  private formatEmailHtml(body: string): string {
    // Convert line breaks to <br> tags
    const htmlBody = body
      .split('\n')
      .map(line => {
        // Convert bullet points to list items
        if (line.trim().startsWith('•')) {
          return `<li>${line.trim().substring(1).trim()}</li>`
        }
        return `<p>${line}</p>`
      })
      .join('')
      .replace(/<p><\/p>/g, '<br>')
      .replace(/<li>/g, '<ul><li>')
      .replace(/<\/li><p>/g, '</li></ul><p>')

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    p {
      margin: 0 0 10px 0;
    }
    ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    li {
      margin: 5px 0;
    }
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .logo {
      color: #0066cc;
      font-weight: bold;
      font-size: 18px;
    }
  </style>
</head>
<body>
  ${htmlBody}
  <div class="signature">
    <p class="logo">SalesPro</p>
    <p style="font-size: 12px; color: #666;">
      Personalized sales proposals that convert
    </p>
  </div>
</body>
</html>`
  }

  /**
   * Send a test email to verify configuration
   */
  async sendTestEmail(to: string): Promise<{ success: boolean; error?: string }> {
    return this.sendProposalEmail({
      to,
      subject: 'Test Email from SalesPro',
      body: `Hi there,

This is a test email from SalesPro to verify your email configuration.

If you're receiving this email, your email service is configured correctly!

Best regards,
The SalesPro Team`
    })
  }

  /**
   * Track email open (would integrate with email service webhooks)
   */
  async trackEmailOpen(messageId: string): Promise<void> {
    // In production, this would update the proposal status
    console.log(`Email opened: ${messageId}`)
  }

  /**
   * Get email delivery status
   */
  async getEmailStatus(messageId: string): Promise<{ status: string; details?: any }> {
    // Mock implementation - in production would check with email service
    return {
      status: 'delivered',
      details: {
        delivered_at: new Date().toISOString(),
        opened: false,
        clicked: false
      }
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()