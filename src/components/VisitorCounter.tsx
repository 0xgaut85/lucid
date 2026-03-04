'use client'

import { useState, useEffect, useRef } from 'react'

const COUNTER_UP = 'https://api.counterapi.dev/v1/getlucid-site/visits/up'

export default function VisitorCounter() {
  const [display, setDisplay] = useState<number | null>(null)
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let cancelled = false

    async function track() {
      let target: number | null = null
      const cached = sessionStorage.getItem('lucid_vc')

      if (cached) {
        target = parseInt(cached, 10)
      } else {
        try {
          const res = await fetch(COUNTER_UP)
          const data = await res.json()
          target = data.count ?? null
          if (target !== null) sessionStorage.setItem('lucid_vc', String(target))
        } catch { /* silent */ }
      }

      if (cancelled || target === null) return

      let current = Math.max(0, target - 25)
      setDisplay(current)
      animRef.current = setInterval(() => {
        const step = Math.max(1, Math.ceil((target! - current) * 0.12))
        current = Math.min(target!, current + step)
        setDisplay(current)
        if (current >= target! && animRef.current) clearInterval(animRef.current)
      }, 35)
    }

    track()
    return () => {
      cancelled = true
      if (animRef.current) clearInterval(animRef.current)
    }
  }, [])

  if (display === null) return null

  return (
    <div className="fixed top-4 left-4 sm:top-8 sm:left-10 z-30 select-none pointer-events-none">
      <span
        className="font-light lowercase block"
        style={{
          fontFamily: 'var(--font-geist-sans)',
          color: '#ffffff',
          fontSize: 'clamp(0.7rem, 2.5vw, 1.2rem)',
          textShadow: '0 0 15px rgba(255,255,255,0.2)',
          letterSpacing: '0.2em',
        }}
      >
        {display.toLocaleString()}
      </span>
    </div>
  )
}
