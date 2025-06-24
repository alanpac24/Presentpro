import { useState, useEffect, useCallback } from 'react'
import { mockUser, PRESENTATION_LIMITS } from '@/lib/constants'

interface PresentationUsage {
  count: number
  lastReset: string
}

const STORAGE_KEY = 'presentpro_presentation_usage'

export function usePresentationUsage() {
  const [usage, setUsage] = useState<PresentationUsage | null>(null)
  const [showLimitModal, setShowLimitModal] = useState(false)

  // Load usage from localStorage
  useEffect(() => {
    const loadUsage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const data = JSON.parse(stored) as PresentationUsage
          
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
        console.error('Error loading presentation usage:', error)
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
  const limit = PRESENTATION_LIMITS[userTier] || PRESENTATION_LIMITS.Free
  const remaining = Math.max(0, limit - (usage?.count || 0))
  const isUnlimited = limit === Infinity

  const canCreatePresentation = useCallback(() => {
    if (isUnlimited) return true
    return !usage || usage.count < limit
  }, [isUnlimited, limit, usage])

  const incrementUsage = useCallback(() => {
    if (isUnlimited) return true

    if (!canCreatePresentation()) {
      setShowLimitModal(true)
      return false
    }

    setUsage(prev => {
      if (!prev) return prev
      
      const newCount = prev.count + 1
      const newUsage = { ...prev, count: newCount }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage))
      
      return newUsage
    })

    return true
  }, [isUnlimited, canCreatePresentation])

  const resetUsage = useCallback(() => {
    const newUsage = {
      count: 0,
      lastReset: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage))
    setUsage(newUsage)
    setShowLimitModal(false)
  }, [])

  return {
    usage: usage?.count || 0,
    limit,
    remaining,
    isUnlimited,
    canCreatePresentation,
    incrementUsage,
    showLimitModal,
    setShowLimitModal,
    resetUsage,
    userTier
  }
}