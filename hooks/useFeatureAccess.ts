import { mockUser } from '@/lib/constants'

export function useFeatureAccess() {
  const userTier = mockUser.tier

  return {
    // Export permissions
    canExportPDF: true, // All tiers can export PDF
    canExportPPT: userTier !== 'Free', // Pro and Professional can export PPT
    
    // Template access
    hasBasicTemplates: true, // All tiers
    hasPremiumTemplates: userTier === 'Professional',
    
    // Features
    hasAIChat: userTier === 'Professional',
    hasCustomBranding: userTier === 'Professional',
    hasPrioritySupport: userTier === 'Professional',
    
    // Limits
    isFreeTier: userTier === 'Free',
    isProTier: userTier === 'Pro', 
    isProfessionalTier: userTier === 'Professional',
    isEnterpriseTier: userTier === 'Enterprise',
    
    // Upgrade prompts
    upgradeMessage: 
      userTier === 'Free' ? 'Upgrade to Pro for PowerPoint export and more presentations' :
      userTier === 'Pro' ? 'Upgrade to Professional for premium templates and AI assistance' :
      null
  }
}