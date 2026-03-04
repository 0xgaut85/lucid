'use client'

import { useState, useRef, useEffect } from 'react'

interface BetaSignupProps {
  open: boolean
  onClose: () => void
}

export default function BetaSignup({ open, onClose }: BetaSignupProps) {
  const [xHandle, setXHandle] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      setSubmitted(false)
      setXHandle('')
      setEmail('')
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: 'var(--font-geist-mono)',
        }}
      >
        {!submitted ? (
          <div
            className="relative"
            style={{
              border: '2px solid #fff',
              background: '#000',
              width: '420px',
              maxWidth: '90vw',
            }}
          >
            {/* Header bar */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '2px solid #fff' }}
            >
              <span
                className="text-white text-xs font-bold tracking-[0.25em] uppercase"
              >
                early access
              </span>
              <button
                onClick={onClose}
                className="text-white hover:text-white/60 transition-colors text-lg leading-none font-mono"
                aria-label="Close"
              >
                [x]
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <p
                className="text-white/60 text-xs tracking-[0.15em] uppercase mb-6"
              >
                join the beta. get early access to lucid agent.
              </p>

              {/* X Handle */}
              <div className="mb-4">
                <label
                  className="block text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2"
                >
                  x handle
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    value={xHandle}
                    onChange={(e) => setXHandle(e.target.value)}
                    placeholder="handle"
                    className="w-full bg-transparent text-white text-sm font-mono tracking-wider pl-8 pr-3 py-3 outline-none placeholder:text-white/20"
                    style={{
                      border: '1px solid rgba(255,255,255,0.25)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#fff' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label
                  className="block text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2"
                >
                  email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@domain.com"
                  className="w-full bg-transparent text-white text-sm font-mono tracking-wider px-3 py-3 outline-none placeholder:text-white/20"
                  style={{
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#fff' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full text-black font-bold text-xs tracking-[0.25em] uppercase py-3 transition-all"
                style={{
                  background: '#fff',
                  border: '2px solid #fff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.color = '#000'
                }}
              >
                request access
              </button>

              <p className="text-white/20 text-[10px] tracking-wider mt-4 text-center">
                no spam. early users only.
              </p>
            </form>
          </div>
        ) : (
          <div
            className="relative text-center"
            style={{
              border: '2px solid #fff',
              background: '#000',
              width: '420px',
              maxWidth: '90vw',
              padding: '3rem 2rem',
            }}
          >
            <div
              className="text-white text-xs font-bold tracking-[0.25em] uppercase mb-4"
            >
              you&apos;re in.
            </div>
            <p className="text-white/50 text-xs tracking-[0.15em] mb-6">
              we&apos;ll reach out when it&apos;s time.
            </p>
            <button
              onClick={onClose}
              className="text-white/40 text-[10px] tracking-[0.2em] uppercase hover:text-white/70 transition-colors"
            >
              [close]
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
