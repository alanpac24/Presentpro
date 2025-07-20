# Slide Components Documentation

This document provides a comprehensive overview of all slide components available in the PresentPro Sales platform. These McKinsey-style templates are designed for creating professional business presentations with AI-powered content generation.

## Table of Contents

1. [Overview](#overview)
2. [Slide Categories](#slide-categories)
3. [Complete Slide Inventory](#complete-slide-inventory)
4. [Usage Guidelines](#usage-guidelines)
5. [AI Integration](#ai-integration)

## Overview

The PresentPro Sales platform includes 30 professionally designed slide templates that follow McKinsey consulting presentation standards. Each slide component:

- Extends `BaseSlideProps` with `id` and optional `className`
- Has a corresponding TypeScript interface in `/components/slides/types.ts`
- Features responsive design using Tailwind CSS
- Includes visual enhancements with Lucide React icons
- Supports dynamic data binding for AI-generated content

## Slide Categories

### 1. Foundation Slides
Basic slides for introductions, content, and summaries.

### 2. Data & Analytics Slides
Slides for presenting metrics, charts, and quantitative analysis.

### 3. Strategic Framework Slides
McKinsey-style frameworks for strategic analysis and planning.

### 4. Implementation Slides
Slides for project planning, timelines, and execution strategies.

## Complete Slide Inventory

### Foundation Slides

#### 1. TitleSlide
**Purpose**: Opening slide for presentations  
**Key Features**:
- Gradient title text
- Company and presenter information
- Date display
- Target icon branding

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  presenter?: string
  company?: string
  date?: string
}
```

#### 2. ContentSlide
**Purpose**: Basic content display with flexible layouts  
**Key Features**:
- Title with underline accent
- Bullet points or paragraph text
- Flexible content formatting

**Data Structure**:
```typescript
{
  title: string
  content?: string
  bullets?: string[]
}
```

#### 3. ExecutiveSummarySlide
**Purpose**: High-level overview with key insights  
**Key Features**:
- Key message highlight box
- Supporting metrics grid
- Recommendation section
- Professional blue accent theme

**Data Structure**:
```typescript
{
  title: string
  keyMessage: string
  supportingPoints: Array<{
    label: string
    value: string
    description: string
  }>
  recommendation: string
}
```

### Data & Analytics Slides

#### 4. MetricsSlide
**Purpose**: Display key performance indicators  
**Key Features**:
- Grid layout for multiple metrics
- Color-coded cards (blue, green, orange, red)
- Trend indicators with icons
- Responsive grid system

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  metrics: Array<{
    label: string
    value: string
    trend?: string
    color?: 'blue' | 'green' | 'orange' | 'red'
  }>
}
```

#### 5. ChartSlide
**Purpose**: Data visualization with various chart types  
**Key Features**:
- Supports bar, line, and pie charts
- Multiple datasets
- Customizable colors
- Chart.js integration ready

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  chartType: 'bar' | 'line' | 'pie'
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string
    }>
  }
}
```

#### 6. KPIDashboardSlide
**Purpose**: Comprehensive KPI overview  
**Key Features**:
- Status indicators (on-track, at-risk, off-track)
- Progress bars
- Trend analysis
- Target vs actual comparison

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  kpis: Array<{
    name: string
    value: string
    unit?: string
    target?: string
    trend?: string
    comparison?: string
    status?: 'on-track' | 'at-risk' | 'off-track'
    progress?: number
  }>
  summary?: string
}
```

#### 7. HeatmapSlide
**Purpose**: Matrix visualization of multi-dimensional data  
**Key Features**:
- Color intensity mapping
- Row and column labels
- Value tooltips
- Customizable color schemes

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  columns: string[]
  rows: Array<{
    label: string
    values: Array<{
      value: number
      label?: string
    }>
  }>
}
```

#### 8. WaterfallChartSlide
**Purpose**: Show cumulative effect of sequential values  
**Key Features**:
- Start, increase, decrease, and end values
- Connecting lines between bars
- Color coding for positive/negative changes
- Value labels

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  items: Array<{
    label: string
    value: number
    type: 'start' | 'increase' | 'decrease' | 'end'
  }>
  units?: string
}
```

#### 9. BenchmarkSlide
**Purpose**: Compare performance against standards  
**Key Features**:
- Multiple metric comparison
- Us vs benchmark vs best-in-class
- Visual bar comparisons
- Insights section

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  metrics: Array<{
    category: string
    us: number
    benchmark: number
    bestInClass: number
    unit?: string
  }>
  insights?: string[]
}
```

#### 10. ROICalculationSlide
**Purpose**: Financial return analysis  
**Key Features**:
- Investment breakdown
- Year-by-year returns
- Key metrics (ROI, payback, NPV)
- Professional financial layout

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  investment: {
    label: string
    value: string
  }
  returns: Array<{
    year: string
    value: string
  }>
  metrics: {
    roi: string
    payback: string
    npv?: string
  }
}
```

#### 11. CostBenefitSlide
**Purpose**: Detailed financial comparison  
**Key Features**:
- Categorized costs and benefits
- Timing information
- Total calculations
- Side-by-side comparison

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  costs: Array<{
    category: string
    description: string
    amount: number
    timing?: string
  }>
  benefits: Array<{
    category: string
    description: string
    amount: number
    timing?: string
  }>
}
```

### Strategic Framework Slides

#### 12. SWOTAnalysisSlide
**Purpose**: Strategic situation analysis  
**Key Features**:
- 2x2 grid layout
- Icon indicators for each quadrant
- Color-coded sections
- Bullet point lists

**Data Structure**:
```typescript
{
  title: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}
```

#### 13. MatrixSlide
**Purpose**: Strategic positioning analysis  
**Key Features**:
- Customizable axes labels
- Bubble positioning
- Size variation for importance
- Quadrant labels
- Interactive tooltips

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  xAxis: { label: string; labels: string[] }
  yAxis: { label: string; labels: string[] }
  quadrants?: Array<{
    name: string
    color: string
  }>
  items: Array<{
    name: string
    x: number // 0-1
    y: number // 0-1
    size?: number
    color?: string
  }>
}
```

#### 14. ValueChainSlide
**Purpose**: Porter's value chain analysis  
**Key Features**:
- Support and primary activities
- Arrow flow visualization
- Margin indicator
- Activity descriptions

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  primaryActivities: Array<{
    name: string
    description: string
  }>
  supportActivities: Array<{
    name: string
    description: string
  }>
}
```

#### 15. CompetitiveLandscapeSlide
**Purpose**: Market positioning visualization  
**Key Features**:
- X/Y axis positioning
- Bubble size for market share
- Competitor highlighting
- "Us" indicator

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  xAxis: string
  yAxis: string
  competitors: Array<{
    name: string
    x: number // 0-100
    y: number // 0-100
    size?: 'small' | 'medium' | 'large'
    description?: string
    isUs?: boolean
  }>
}
```

#### 16. MarketSizingSlide
**Purpose**: TAM/SAM/SOM market analysis  
**Key Features**:
- Funnel visualization
- Three-tier structure
- Growth indicator
- Icon representations

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  tam: { value: string; description: string }
  sam: { value: string; description: string }
  som: { value: string; description: string }
  growth?: string
}
```

#### 17. InitiativePrioritizationSlide
**Purpose**: Project prioritization matrix  
**Key Features**:
- Impact/effort assessment
- Value indicators
- Timeframe planning
- Owner assignment

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  initiatives: Array<{
    name: string
    impact: 'high' | 'medium' | 'low'
    effort: 'high' | 'medium' | 'low'
    value?: string
    timeframe?: string
    owner?: string
  }>
  totalValue?: string
}
```

#### 18. HypothesisTreeSlide
**Purpose**: Structured hypothesis testing  
**Key Features**:
- Hierarchical tree structure
- Status indicators
- Evidence tracking
- Data requirements

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  mainHypothesis: string
  branches: Array<{
    hypothesis: string
    status?: 'proven' | 'disproven' | 'partial' | 'untested'
    evidence?: string
    dataRequired?: string
    subHypotheses?: Array<{
      hypothesis: string
      status?: 'proven' | 'disproven' | 'partial' | 'untested'
      evidence?: string
      dataRequired?: string
    }>
  }>
}
```

#### 19. DecisionTreeSlide
**Purpose**: Decision analysis with probabilities  
**Key Features**:
- Branching structure
- Decision/chance/outcome nodes
- Probability values
- Expected value calculation

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  tree: {
    type: 'decision' | 'chance' | 'outcome'
    label: string
    value?: string
    probability?: string
    branches?: Array<{
      type: 'decision' | 'chance' | 'outcome'
      label: string
      value?: string
      probability?: string
      branches?: any[]
    }>
  }
  expectedValue?: string
}
```

#### 20. StakeholderMapSlide
**Purpose**: Stakeholder analysis and engagement  
**Key Features**:
- Influence/interest grid
- Sentiment indicators
- Role descriptions
- Engagement strategies

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  stakeholders: Array<{
    name: string
    influence: 'high' | 'medium' | 'low'
    interest: 'high' | 'medium' | 'low'
    sentiment?: 'supportive' | 'neutral' | 'opposed'
    role?: string
  }>
}
```

#### 21. RiskMatrixSlide
**Purpose**: Risk assessment and mitigation  
**Key Features**:
- Impact/likelihood matrix
- Risk categorization
- Mitigation strategies
- Color-coded severity

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  risks: Array<{
    name: string
    description: string
    impact: 'High' | 'Medium' | 'Low'
    likelihood: 'High' | 'Medium' | 'Low'
    mitigation?: string
  }>
}
```

#### 22. ComparisonSlide
**Purpose**: Side-by-side feature comparison  
**Key Features**:
- Two-column layout
- Feature-by-feature comparison
- Visual separation
- Clear labeling

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  leftTitle: string
  rightTitle: string
  comparisons: Array<{
    feature: string
    left: string
    right: string
  }>
}
```

### Implementation Slides

#### 23. TimelineSlide
**Purpose**: Project timeline with phases  
**Key Features**:
- Phase-based structure
- Activity listings
- Milestone markers
- Duration indicators

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  phases: Array<{
    phase: string
    duration: string
    activities: string[]
    milestone?: string
  }>
}
```

#### 24. RoadmapSlide
**Purpose**: Detailed implementation roadmap  
**Key Features**:
- Gantt-style visualization
- Multiple workstreams
- Phase coordination
- Color-coded phases

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  phases: Array<{
    name: string
    duration: string
    workstreams: Array<{
      name: string
      activities: string[]
    }>
  }>
}
```

#### 25. ProcessFlowSlide
**Purpose**: Step-by-step process visualization  
**Key Features**:
- Sequential flow with arrows
- Step numbering
- Sub-step details
- Process metrics

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  steps: Array<{
    name: string
    description: string
    duration?: string
    subSteps?: string[]
  }>
  metrics?: {
    totalTime?: string
    efficiency?: string
    costSaving?: string
  }
}
```

#### 26. QuickWinsSlide
**Purpose**: Immediate value opportunities  
**Key Features**:
- Time-based categorization
- Impact assessment
- Owner assignment
- Action-oriented layout

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  timeframes: Array<{
    period: string
    actions: Array<{
      action: string
      impact: string
      owner?: string
    }>
  }>
}
```

#### 27. OrgStructureSlide
**Purpose**: Organizational hierarchy visualization  
**Key Features**:
- Hierarchical tree layout
- Department grouping
- Highlighting capability
- Statistics summary

**Data Structure**:
```typescript
{
  title: string
  subtitle?: string
  structure: {
    title: string
    name?: string
    department?: string
    reports?: Array<{
      title: string
      name?: string
      department?: string
      highlight?: boolean
      reports?: any[]
    }>
    highlight?: boolean
  }
  stats?: {
    totalEmployees?: number
    departments?: number
    reportingLevels?: number
  }
}
```

#### 28. KeyMessageSlide
**Purpose**: Single impactful message  
**Key Features**:
- Large centered message
- Supporting facts
- Source attribution
- Minimalist design

**Data Structure**:
```typescript
{
  message: string
  supportingFacts: string[]
  source?: string
}
```

## Usage Guidelines

### 1. Selecting the Right Slide

Choose slides based on your content type:
- **Quantitative data**: Use MetricsSlide, ChartSlide, or KPIDashboardSlide
- **Strategic analysis**: Use MatrixSlide, SWOTAnalysisSlide, or ValueChainSlide
- **Financial justification**: Use ROICalculationSlide or CostBenefitSlide
- **Implementation planning**: Use RoadmapSlide, TimelineSlide, or ProcessFlowSlide
- **Market analysis**: Use MarketSizingSlide or CompetitiveLandscapeSlide

### 2. Design Consistency

All slides follow these design principles:
- Clean, professional McKinsey-style layout
- Consistent color palette (blue primary, green success, orange warning, red danger)
- Responsive design for various screen sizes
- Clear visual hierarchy with titles, subtitles, and content areas
- Appropriate use of icons for visual enhancement

### 3. Data Preparation

When preparing data for slides:
- Keep text concise and impactful
- Use specific numbers and percentages
- Provide clear labels for all data points
- Include sources when relevant
- Ensure data accuracy and consistency

## AI Integration

The slide components are fully integrated with the AI service for automated content generation:

### 1. AI Service Mapping

The AI service (`/lib/services/ai-service.ts`) can generate appropriate data structures for each slide type based on:
- Presentation context
- Target audience
- Sales stage
- Industry information
- Company-specific data

### 2. Dynamic Slide Selection

The AI analyzes the presentation prompt and automatically selects appropriate slides based on:
- **Discovery stage**: Executive Summary, SWOT Analysis, Market Sizing
- **Demo stage**: Value Chain, Process Flow, ROI Calculation
- **Proposal stage**: Cost-Benefit, Risk Matrix, Implementation Roadmap
- **Closing stage**: Quick Wins, KPI Dashboard, Next Steps

### 3. Content Personalization

AI-generated content is personalized using:
- Company research data
- Industry trends and challenges
- Competitor analysis
- Budget and timeline constraints
- Specific pain points and opportunities

### 4. Best Practices for AI Generation

To get the best results from AI-powered slide generation:
1. Provide detailed context about the company and industry
2. Specify the sales stage and objectives
3. Include relevant challenges and pain points
4. Mention competitors for positioning slides
5. Set clear budget and timeline parameters

## Example Usage

```typescript
// Using a slide component
import { ExecutiveSummarySlide } from '@/components/slides'

const data = {
  title: "Transform Your Sales Process",
  keyMessage: "Increase revenue by 40% through AI-powered automation",
  supportingPoints: [
    {
      label: "Current State",
      value: "$10M",
      description: "Annual revenue"
    },
    {
      label: "Projected State", 
      value: "$14M",
      description: "With our solution"
    },
    {
      label: "Time to Value",
      value: "3 months",
      description: "Full implementation"
    }
  ],
  recommendation: "Start with a pilot program in Q1 2024"
}

<ExecutiveSummarySlide id="exec-summary" data={data} />
```

## Conclusion

The PresentPro Sales platform provides a comprehensive suite of McKinsey-quality slide templates that, combined with AI-powered content generation, enable the creation of professional, personalized sales presentations at scale. Each slide is designed to communicate complex information clearly and persuasively, following best practices in business presentation design.