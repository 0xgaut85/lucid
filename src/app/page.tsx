'use client'

import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import ParticleOrb from '@/components/ParticleOrb'
import BetaSignup from '@/components/BetaSignup'
import VisitorCounter from '@/components/VisitorCounter'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useCallback, useEffect, useRef } from 'react'

export default function Home() {
  const [signupOpen, setSignupOpen] = useState(false)
  const [portalEl, setPortalEl] = useState<HTMLDivElement | null>(null)
  const portalRef = useCallback((node: HTMLDivElement | null) => {
    setPortalEl(node)
  }, [])

  const [isMobile, setIsMobile] = useState(false)
  const touchActiveRef = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Inline SVG filter for native-resolution film grain */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="noiseGrain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="bwNoise"
            />
          </filter>
        </defs>
      </svg>
      <div className="noise-bg" />
      <div className="w-full relative" style={{ height: '100dvh' }}>
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 35%, transparent 65%)',
          }}
        />

        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 50% 50%, rgba(200,210,255,0.03) 0%, transparent 60%)',
          }}
        />

        <div
          className="absolute inset-0 z-[1]"
          style={{ touchAction: 'none' }}
          onTouchStart={() => { touchActiveRef.current = true }}
          onTouchEnd={() => { touchActiveRef.current = false }}
        >
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
            <color attach="background" args={['#000000']} />
            <ParticleOrb
              labelPortal={portalEl}
              onSignupOpen={() => setSignupOpen(true)}
              isMobile={isMobile}
              touchActiveRef={touchActiveRef}
            />
            <EffectComposer>
              <Bloom
                intensity={1.8}
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
            </EffectComposer>
          </Canvas>
        </div>

        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.8) 100%)',
          }}
        />

        {/* Portal target for drei Html labels — above the vignette */}
        <div ref={portalRef} className="absolute inset-0 z-[5] pointer-events-none" />
      </div>

      <VisitorCounter />
      <BetaSignup open={signupOpen} onClose={() => setSignupOpen(false)} />

      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 sm:px-10 sm:py-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/terms" className="text-white/40 hover:text-white/70 transition-colors text-xs sm:text-sm font-sans font-light tracking-wider">
            Terms of Use
          </Link>
          <Link href="/legal" className="text-white/40 hover:text-white/70 transition-colors text-xs sm:text-sm font-sans font-light tracking-wider">
            Legal
          </Link>
        </div>
        <span className="text-white/40 text-xs sm:text-sm font-sans font-light tracking-wider flex items-center gap-2">
          © 2026
          <Image
            src="/logo.png"
            alt="Lucid logo"
            width={20}
            height={20}
            className="opacity-60 inline-block"
          />
          Lucid
        </span>
      </div>
    </main>
  )
}
