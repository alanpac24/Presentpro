import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { ProposalContent } from '@/lib/services/ai-service'

// Register fonts for professional typography
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v1/HelveticaNeue-Regular.ttf' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v1/HelveticaNeue-Bold.ttf', fontWeight: 'bold' },
  ]
})

// McKinsey-style color palette
const colors = {
  primary: '#0066cc',
  secondary: '#003d7a',
  accent: '#00a3e0',
  text: '#333333',
  lightText: '#666666',
  background: '#ffffff',
  lightGray: '#f5f5f5',
  borderGray: '#e0e0e0',
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: colors.background,
    padding: 60,
    fontFamily: 'Helvetica',
  },
  slideContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
  },
  metricBox: {
    backgroundColor: colors.primary,
    padding: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  metricValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 16,
    color: colors.background,
    textAlign: 'center',
  },
  contentBlock: {
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 1.6,
  },
  bulletList: {
    paddingLeft: 20,
  },
  bulletItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 30,
  },
  column: {
    flex: 1,
  },
  keyInsight: {
    backgroundColor: colors.lightGray,
    padding: 20,
    borderRadius: 8,
    borderLeft: `4px solid ${colors.primary}`,
    marginTop: 20,
  },
  keyInsightText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
  },
  quote: {
    padding: 20,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginTop: 10,
  },
  quoteText: {
    fontSize: 16,
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteAttribution: {
    fontSize: 12,
    color: colors.lightText,
    textAlign: 'right',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.lightGray,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  metricCardLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  metricCardTrend: {
    fontSize: 10,
    color: colors.lightText,
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 10,
    color: colors.lightText,
  },
  logo: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: 'bold',
  },
})

interface ProposalDocumentProps {
  content: ProposalContent
  companyName: string
  contactName: string
  contactEmail: string
}

export const ProposalDocument: React.FC<ProposalDocumentProps> = ({
  content,
  companyName,
  contactName,
  contactEmail,
}) => {
  const renderContent = (item: any) => {
    switch (item.type) {
      case 'metric':
        return (
          <View style={styles.metricBox} key={item.content}>
            <Text style={styles.metricValue}>{item.content}</Text>
            <Text style={styles.metricLabel}>{item.subContent}</Text>
          </View>
        )
      
      case 'text':
        return (
          <View style={styles.contentBlock} key={item.content}>
            <Text style={styles.contentTitle}>{item.content}</Text>
            <Text style={styles.contentText}>{item.subContent}</Text>
          </View>
        )
      
      case 'bullet':
        return (
          <View style={styles.contentBlock} key={item.content}>
            <Text style={styles.contentTitle}>{item.content}</Text>
            <View style={styles.bulletList}>
              {item.subContent?.split('\n').map((bullet: string, idx: number) => (
                <Text key={idx} style={styles.bulletItem}>{bullet}</Text>
              ))}
            </View>
          </View>
        )
      
      case 'quote':
        return (
          <View style={styles.quote} key={item.content}>
            <Text style={styles.quoteText}>"{item.content}"</Text>
            <Text style={styles.quoteAttribution}>{item.subContent}</Text>
          </View>
        )
      
      default:
        return null
    }
  }

  return (
    <Document>
      {/* Slide 1: Executive Summary */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.slideContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{content.executiveSummary.title}</Text>
            <Text style={styles.subtitle}>{content.executiveSummary.subtitle}</Text>
          </View>
          
          <View style={styles.content}>
            {content.executiveSummary.mainContent.slice(0, 1).map(renderContent)}
            
            <View style={styles.twoColumn}>
              <View style={styles.column}>
                {content.executiveSummary.mainContent.slice(1, 2).map(renderContent)}
              </View>
              <View style={styles.column}>
                {content.executiveSummary.mainContent.slice(2, 3).map(renderContent)}
              </View>
            </View>
            
            {content.executiveSummary.keyInsight && (
              <View style={styles.keyInsight}>
                <Text style={styles.keyInsightText}>{content.executiveSummary.keyInsight}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.pageNumber}>1</Text>
            <Text style={styles.logo}>SALESPRO</Text>
          </View>
        </View>
      </Page>

      {/* Slide 2: Business Understanding */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.slideContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{content.businessUnderstanding.title}</Text>
            <Text style={styles.subtitle}>{content.businessUnderstanding.subtitle}</Text>
          </View>
          
          <View style={styles.content}>
            {content.businessUnderstanding.mainContent.map(renderContent)}
            
            {content.businessUnderstanding.keyInsight && (
              <View style={styles.keyInsight}>
                <Text style={styles.keyInsightText}>{content.businessUnderstanding.keyInsight}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.pageNumber}>2</Text>
            <Text style={styles.logo}>SALESPRO</Text>
          </View>
        </View>
      </Page>

      {/* Slide 3: Problem & Solution */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.slideContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{content.problemSolution.title}</Text>
            <Text style={styles.subtitle}>{content.problemSolution.subtitle}</Text>
          </View>
          
          <View style={styles.content}>
            <View style={styles.metricsGrid}>
              {content.problemSolution.mainContent
                .filter(item => item.type === 'metric')
                .slice(0, 3)
                .map((metric, idx) => (
                  <View key={idx} style={styles.metricCard}>
                    <Text style={styles.metricCardValue}>{metric.content}</Text>
                    <Text style={styles.metricCardLabel}>{metric.subContent}</Text>
                  </View>
                ))}
            </View>
            
            <View style={styles.twoColumn}>
              <View style={styles.column}>
                {content.problemSolution.mainContent
                  .filter(item => item.type !== 'metric' && item.type !== 'quote')
                  .slice(0, 1)
                  .map(renderContent)}
              </View>
              <View style={styles.column}>
                {content.problemSolution.mainContent
                  .filter(item => item.type !== 'metric' && item.type !== 'quote')
                  .slice(1, 2)
                  .map(renderContent)}
              </View>
            </View>
            
            {content.problemSolution.mainContent
              .filter(item => item.type === 'quote')
              .map(renderContent)}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.pageNumber}>3</Text>
            <Text style={styles.logo}>SALESPRO</Text>
          </View>
        </View>
      </Page>

      {/* Slide 4: Implementation */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.slideContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{content.implementation.title}</Text>
            <Text style={styles.subtitle}>{content.implementation.subtitle}</Text>
          </View>
          
          <View style={styles.content}>
            <View style={styles.twoColumn}>
              <View style={styles.column}>
                {content.implementation.mainContent.slice(0, 2).map(renderContent)}
              </View>
              <View style={styles.column}>
                {content.implementation.mainContent.slice(2, 4).map(renderContent)}
              </View>
            </View>
            
            {content.implementation.metrics && (
              <View style={styles.metricsGrid}>
                {content.implementation.metrics.map((metric, idx) => (
                  <View key={idx} style={styles.metricCard}>
                    <Text style={styles.metricCardValue}>{metric.value}</Text>
                    <Text style={styles.metricCardLabel}>{metric.label}</Text>
                    {metric.trend && (
                      <Text style={styles.metricCardTrend}>{metric.trend}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.pageNumber}>4</Text>
            <Text style={styles.logo}>SALESPRO</Text>
          </View>
        </View>
      </Page>

      {/* Slide 5: Investment & Next Steps */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.slideContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{content.investment.title}</Text>
            <Text style={styles.subtitle}>{content.investment.subtitle}</Text>
          </View>
          
          <View style={styles.content}>
            {content.investment.mainContent.slice(0, 1).map(renderContent)}
            
            <View style={styles.twoColumn}>
              <View style={styles.column}>
                {content.investment.mainContent.slice(1, 3).map(renderContent)}
              </View>
              <View style={styles.column}>
                {content.investment.mainContent.slice(3, 5).map(renderContent)}
              </View>
            </View>
            
            {content.investment.keyInsight && (
              <View style={styles.keyInsight}>
                <Text style={styles.keyInsightText}>{content.investment.keyInsight}</Text>
              </View>
            )}
            
            <View style={styles.contentBlock}>
              <Text style={styles.contentTitle}>Contact Information</Text>
              <Text style={styles.contentText}>{contactName}</Text>
              <Text style={styles.contentText}>{contactEmail}</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.pageNumber}>5</Text>
            <Text style={styles.logo}>SALESPRO</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ProposalDocument