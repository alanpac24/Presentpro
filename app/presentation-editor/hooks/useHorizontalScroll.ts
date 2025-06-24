import { useEffect, RefObject } from "react"

export function useHorizontalScroll(scrollContainerRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainerRef.current && scrollContainerRef.current.contains(e.target as Node)) {
        e.preventDefault()
        const scrollAmount = e.deltaY * 2
        const scrollContainer = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]')
        if (scrollContainer) {
          scrollContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
          })
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [scrollContainerRef])
}