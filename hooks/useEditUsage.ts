import { useState, useEffect, useCallback } from 'react'
import { mockUser } from '@/lib/constants'

interface EditUsage {
  count: number
  lastReset: string
  dismissedUntil?: string
}

interface EditLimits {
  [key: string]: number
}

const EDIT_LIMITS: EditLimits = {
  Free: 5,
  Pro: 150,
  Professional: 500,
  Enterprise: Infinity
}

const STORAGE_KEY = 'presentpro_edit_usage'

export function useEditUsage() {
  const [usage, setUsage] = useState<EditUsage | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Load usage from localStorage
  useEffect(() => {
    const loadUsage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const data = JSON.parse(stored) as EditUsage
          
          // Check if we need to reset monthly
          const lastResetDate = new Date(data.lastReset)
          const now = new Date()
          const monthsDiff = (now.getFullYear() - lastResetDate.getFullYear()) * 12 + 
                            (now.getMonth() - lastResetDate.getMonth())
          
          if (monthsDiff >= 1) {
            // Reset for new month
            const newUsage = {
              count: 0,
              lastReset: now.toISOString()
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage))
            setUsage(newUsage)
          } else {
            setUsage(data)
          }
        } else {
          // Initialize
          const newUsage = {
            count: 0,
            lastReset: new Date().toISOString()
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage))
          setUsage(newUsage)
        }
      } catch (error) {
        console.error('Error loading edit usage:', error)
        // Initialize on error
        const newUsage = {
          count: 0,
          lastReset: new Date().toISOString()
        }
        setUsage(newUsage)
      }
    }

    loadUsage()
  }, [])

  const userTier = mockUser.tier
  const limit = EDIT_LIMITS[userTier] || EDIT_LIMITS.Free
  const percentage = usage ? (usage.count / limit) * 100 : 0
  const remaining = Math.max(0, limit - (usage?.count || 0))
  const isUnlimited = userTier === 'Enterprise'

  // Check if modal was dismissed recently
  const isModalDismissed = useCallback(() => {
    if (!usage?.dismissedUntil) return false
    return new Date() < new Date(usage.dismissedUntil)
  }, [usage])

  // Update usage thresholds
  useEffect(() => {
    if (isUnlimited || !usage) return

    // Show toast at 80% usage
    if (percentage >= 80 && percentage < 100 && !showToast) {
      setShowToast(true)
    } else if (percentage < 80 && showToast) {
      setShowToast(false)
    }

    // Show modal at 100% usage (unless dismissed)
    if (percentage >= 100 && !isModalDismissed() && !showModal) {
      setShowModal(true)
    } else if ((percentage < 100 || isModalDismissed()) && showModal) {
      setShowModal(false)
    }
  }, [percentage, usage, isUnlimited, showToast, showModal, isModalDismissed])

  const incrementUsage = useCallback(() => {
    if (isUnlimited) return true // Always allow for Enterprise

    setUsage(prev => {
      if (!prev) return prev
      
      const newCount = prev.count + 1
      const newUsage = { ...prev, count: newCount }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage))
      
      // Check if we've hit the limit and modal isn't dismissed
      if (newCount >= limit && !isModalDismissed()) {
        return newUsage
      }
      
      return newUsage
    })

    // Return whether the action is allowed
    return !usage || usage.count < limit || isModalDismissed()
  }, [isUnlimited, limit, usage, isModalDismissed])

  const dismissModal = useCallback((hours: number = 2) => {
    const dismissedUntil = new Date()
    dismissedUntil.setHours(dismissedUntil.getHours() + hours)
    
    setUsage(prev => {
      if (!prev) return prev
      const newUsage = { ...prev, dismissedUntil: dismissedUntil.toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage))
      return newUsage
    })
    
    setShowModal(false)
  }, [])

  const resetUsage = useCallback(() => {
    const newUsage = {
      count: 0,
      lastReset: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage))
    setUsage(newUsage)
    setShowToast(false)
    setShowModal(false)
  }, [])

  return {
    usage: usage?.count || 0,
    limit,
    remaining,
    percentage,
    isUnlimited,
    showToast,
    showModal,
    incrementUsage,
    dismissModal,
    resetUsage,
    userTier
  }
}