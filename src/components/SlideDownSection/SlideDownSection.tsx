import React, { useRef, useEffect, useState } from 'react'

function SlideDownSection({ children }: { children: React.ReactNode }) {
  const domRef = useRef<HTMLDivElement>(null)
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio >= 0.2) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    if (domRef.current) observer.observe(domRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={domRef}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-40px)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)'
      }}
    >
      {children}
    </div>
  )
}

export default SlideDownSection
