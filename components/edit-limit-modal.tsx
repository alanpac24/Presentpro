"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Zap, Crown, CheckCircle, FileText, Sparkles, HeadphonesIcon } from "lucide-react"
import { mockUser, updateUserTier } from "@/lib/constants"

interface EditLimitModalProps {
  show: boolean
  userTier: string
  usage: number
  limit: number
  onDismiss: () => void
}

export function EditLimitModal({ show, userTier, usage, limit, onDismiss }: EditLimitModalProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    // Determine the next tier based on current tier
    const nextTier = userTier === 'Free' ? 'Pro' : 'Professional'
    
    // Update the user tier
    updateUserTier(nextTier)
    
    // Reset edit usage when upgrading
    const editUsageKey = 'presentpro_edit_usage'
    try {
      const currentUsage = localStorage.getItem(editUsageKey)
      if (currentUsage) {
        const usage = JSON.parse(currentUsage)
        const updatedUsage = {
          ...usage,
          count: 0,
          lastReset: new Date().toISOString()
        }
        localStorage.setItem(editUsageKey, JSON.stringify(updatedUsage))
      }
    } catch (error) {
      console.error('Error resetting edit usage:', error)
    }
    
    // Close the modal
    onDismiss()
    
    // Force page reload to update all components with new tier
    window.location.reload()
  }

  const handleBuyEdits = () => {
    // TODO: Implement Stripe checkout for purchasing additional edits
    // For now, redirect to upgrade page
    router.push("/upgrade")
  }

  const getUpgradeDetails = () => {
    if (userTier === 'Free') {
      return {
        nextTier: 'Pro',
        nextLimit: 150,
        price: '$29/month',
        multiplier: '30x',
        benefits: [
          { icon: Zap, text: '150 edits per month (vs 5)' },
          { icon: FileText, text: '10 presentations per month' },
          { icon: Sparkles, text: 'Premium templates library' },
          { icon: HeadphonesIcon, text: 'Priority email support' }
        ]
      }
    } else if (userTier === 'Pro') {
      return {
        nextTier: 'Professional',
        nextLimit: 500,
        price: '$79/month',
        multiplier: '3x',
        benefits: [
          { icon: Zap, text: '500 edits per month (vs 150)' },
          { icon: FileText, text: '50 presentations per month' },
          { icon: Sparkles, text: 'AI chat assistance' },
          { icon: Crown, text: 'Custom branding & priority support' }
        ]
      }
    }
    return null
  }

  const upgradeDetails = getUpgradeDetails()

  return (
    <Dialog open={show} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-xl">Edit Limit Reached</DialogTitle>
          </div>
          <DialogDescription className="text-base mt-3">
            You've used all {limit} edits for this month. 
            {userTier === 'Free' 
              ? " Don't let your creativity stop here!"
              : userTier === 'Pro'
              ? " Take your presentations to the next level!"
              : " Purchase additional edits to continue."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Monthly edits used</span>
            <span className="font-semibold text-gray-900">{usage} / {limit}</span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {upgradeDetails && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-blue-900">
                Upgrade to {upgradeDetails.nextTier}
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {upgradeDetails.multiplier} more edits!
              </span>
            </div>
            <div className="space-y-2">
              {upgradeDetails.benefits.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{benefit.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-col gap-3">
          {userTier === 'Free' || userTier === 'Pro' ? (
            <>
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-blue-600 hover:bg-blue-700 h-auto py-3"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {userTier === 'Free' 
                      ? `Get ${upgradeDetails?.nextLimit} edits/month - Upgrade to Pro`
                      : `Get ${upgradeDetails?.nextLimit} edits/month - Go Professional`
                    }
                  </div>
                  <span className="text-xs opacity-90">
                    Only {upgradeDetails?.price} - Instant access
                  </span>
                </div>
              </Button>
              <Button 
                variant="ghost" 
                onClick={onDismiss}
                className="w-full"
              >
                I'll manage with {limit} edits
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleBuyEdits}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Buy 100 more edits - $10
              </Button>
              <button
                onClick={onDismiss}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Remind me later
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}