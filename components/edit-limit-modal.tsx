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
import { AlertCircle, Zap, Crown } from "lucide-react"

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
    router.push("/upgrade")
  }

  const handleBuyEdits = () => {
    // TODO: Implement Stripe checkout for purchasing additional edits
    // For now, redirect to upgrade page
    router.push("/upgrade")
  }

  return (
    <Dialog open={show} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
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
              ? " Upgrade to Pro for more presentations and edits."
              : userTier === 'Pro'
              ? " Upgrade to Professional for 50 presentations per month and premium features."
              : " Purchase additional edits to continue."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Monthly edits used</span>
            <span className="font-semibold text-gray-900">{usage} / {limit}</span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-3">
          {userTier === 'Free' || userTier === 'Pro' ? (
            <>
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                {userTier === 'Free' ? 'Upgrade to Pro' : 'Upgrade to Professional'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={onDismiss}
                className="w-full"
              >
                Remind me later
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