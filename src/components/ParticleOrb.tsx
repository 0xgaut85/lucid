'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { ROOT_ORB, LEVEL1, LEVEL2_SOCIALS, LEVEL2_AGENT, CURSOR, ANIMATION, SPLIT_DIRS } from '@/lib/orb-config'
import { buildVertexShader, buildFragmentShader } from '@/lib/glsl-lib'
import agentPoints from '@/lib/agent-points.json'

const vertexShader = buildVertexShader()
const fragmentShader = buildFragmentShader()

interface ParticleOrbProps {
  labelPortal: HTMLDivElement | null
  onSignupOpen: () => void
  isMobile: boolean
  touchActiveRef: React.MutableRefObject<boolean>
}

export default function ParticleOrb({ labelPortal, onSignupOpen, isMobile, touchActiveRef }: ParticleOrbProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const { dense, core, shell } = ROOT_ORB.particles
  const totalCount = dense + core + shell
  const sphereRadius = ROOT_ORB.radius

  const [positions, originalPositions, randoms, agentTargets, agentBrightness] = useMemo(() => {
    const pos = new Float32Array(totalCount * 3)
    const orig = new Float32Array(totalCount * 3)
    const rnd = new Float32Array(totalCount)
    const agentT = new Float32Array(totalCount * 3)
    const agentB = new Float32Array(totalCount)
    let idx = 0

    const agentCenter = new THREE.Vector3(...LEVEL1.nodes[0].center)

    const dirTL = new THREE.Vector3(...SPLIT_DIRS.topLeft).normalize()
    const dirTR = new THREE.Vector3(...SPLIT_DIRS.topRight).normalize()
    const dirB = new THREE.Vector3(...SPLIT_DIRS.bottom).normalize()

    let agentIdx = 0;
    const numAgentPoints = agentPoints.length;

    const addParticle = (x: number, y: number, z: number) => {
      pos[idx * 3] = x; pos[idx * 3 + 1] = y; pos[idx * 3 + 2] = z
      orig[idx * 3] = x; orig[idx * 3 + 1] = y; orig[idx * 3 + 2] = z
      rnd[idx] = Math.random()

      const nPos = new THREE.Vector3(x, y, z).normalize()
      const wTL = Math.max(0.0, nPos.dot(dirTL))
      const wTR = Math.max(0.0, nPos.dot(dirTR))
      const wB = Math.max(0.0, nPos.dot(dirB))

      if (wTL > wTR && wTL > wB) {
        const pt = agentPoints[agentIdx % numAgentPoints] as [number, number, number];
        agentIdx++;
        
        agentT[idx * 3] = pt[0] * 2.5 + agentCenter.x;
        agentT[idx * 3 + 1] = pt[1] * 2.5 + agentCenter.y;
        agentT[idx * 3 + 2] = agentCenter.z + (Math.random() - 0.5) * 0.2;
        agentB[idx] = pt[2];
      } else {
        agentT[idx * 3] = 0
        agentT[idx * 3 + 1] = 0
        agentT[idx * 3 + 2] = 0
        agentB[idx] = 0.0;
      }

      idx++
    }

    for (let i = 0; i < dense; i++) {
      const u = Math.random(), v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = Math.pow(Math.random(), 2.0) * sphereRadius * 0.45
      addParticle(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi))
    }

    for (let i = 0; i < core; i++) {
      const u = Math.random(), v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = Math.pow(Math.random(), 1 / 3) * sphereRadius * 0.92
      addParticle(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi))
    }

    for (let i = 0; i < shell; i++) {
      const u = Math.random(), v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = sphereRadius * (0.88 + Math.random() * 0.12)
      addParticle(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi))
    }

    return [pos, orig, rnd, agentT, agentB]
  }, [totalCount, sphereRadius])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector3(999, 999, 999) },
    uHoverProgress: { value: 0 },
    uSocialsProgress: { value: 0 },
    uAgentProgress: { value: 0 },
    uCameraZ: { value: LEVEL1.zoom.position[2] },
    uForwardFlags: { value: new THREE.Vector3(0, 0, 0) },
  }), [])

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const targetVec = useMemo(() => new THREE.Vector3(), [])
  const camTargetVec = useMemo(() => new THREE.Vector3(), [])
  const lookAtVec = useMemo(() => new THREE.Vector3(), [])

  const defaultCamPos = useMemo(() => new THREE.Vector3(...LEVEL1.zoom.position), [])
  const socialsCamPos = useMemo(() => new THREE.Vector3(...LEVEL2_SOCIALS.zoom.position), [])
  const agentCamPos = useMemo(() => new THREE.Vector3(...LEVEL2_AGENT.zoom.position), [])

  const orbCenters3D = useMemo(() =>
    LEVEL1.nodes.map(n => new THREE.Vector3(...n.center)),
  [])

  const portalRef = useMemo(() =>
    labelPortal ? { current: labelPortal } : undefined,
    [labelPortal]
  )

  // Label DOM refs for direct manipulation in useFrame (avoids React re-renders)
  const mainTitleRef = useRef<HTMLDivElement>(null)
  const mainLabelRefs = useRef<(HTMLDivElement | null)[]>([])
  const subLabelRefs = useRef<(HTMLDivElement | null)[]>([])
  const agentLabelRef = useRef<HTMLDivElement>(null)
  const agentGlowRef = useRef<HTMLDivElement>(null)
  const agentBtnHovered = useRef(false)

  const isHovered = useRef(false)
  const hoverProgress = useRef(0)
  const socialsProgress = useRef(0)
  const agentProgress = useRef(0)

  const prevMobileRef = useRef<boolean | null>(null)
  const mobilePhase = useRef<'idle' | 'split' | 'socials' | 'agent'>('idle')
  const wasTouching = useRef(false)

  const labelStyle = useMemo<React.CSSProperties>(() => ({
    fontFamily: 'var(--font-geist-sans)',
    color: '#ffffff',
    fontSize: isMobile ? '0.85rem' : '1.2rem',
    textShadow: '0 0 15px rgba(255,255,255,0.2)',
    letterSpacing: isMobile ? '0.15em' : '0.3em',
  }), [isMobile])

  useFrame((state) => {
    if (!materialRef.current) return

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    materialRef.current.uniforms.uCameraZ.value = state.camera.position.z

    if (prevMobileRef.current !== isMobile) {
      const pc = state.camera as THREE.PerspectiveCamera
      pc.fov = isMobile ? 72 : 45
      pc.updateProjectionMatrix()
      prevMobileRef.current = isMobile
    }

    state.camera.updateMatrixWorld()
    state.raycaster.setFromCamera(state.pointer, state.camera)
    state.raycaster.ray.intersectPlane(plane, targetVec)

    const distanceFromCenter = targetVec.length()

    const advance = (cur: number, target: number, rate: number) => {
      let v = cur + (target - cur) * rate
      if (target === 1.0 && v > 0.5) {
        v = Math.min(1.0, v + (v - 0.5) * 0.01)
      }
      if (target === 0.0 && v < 0.5) {
        v = Math.max(0.0, v - (0.5 - v) * 0.01)
      }
      if (Math.abs(v - target) < 0.002) v = target
      return v
    }

    let hTarget: number
    let sHovered: boolean
    let aHoveredNow: boolean
    let fwdHover: boolean
    let fwdSocials: boolean
    let fwdAgent: boolean

    if (isMobile) {
      const touching = touchActiveRef.current
      if (wasTouching.current && !touching) {
        const phase = mobilePhase.current
        if (phase === 'idle') {
          if (distanceFromCenter < sphereRadius * 1.5) {
            mobilePhase.current = 'split'
          }
        } else if (phase === 'split') {
          const dS = targetVec.distanceTo(orbCenters3D[1])
          const dA = targetVec.distanceTo(orbCenters3D[0])
          if (dS < LEVEL1.hoverRadius + 0.5) {
            mobilePhase.current = 'socials'
          } else if (dA < LEVEL1.hoverRadius + 0.5) {
            mobilePhase.current = 'agent'
          } else {
            mobilePhase.current = 'idle'
          }
        } else {
          mobilePhase.current = 'split'
        }
      }
      wasTouching.current = touching

      const p = mobilePhase.current
      hTarget = p !== 'idle' ? 1.0 : 0.0
      sHovered = p === 'socials' && hoverProgress.current > 0.9
      aHoveredNow = p === 'agent' && hoverProgress.current > 0.9
      fwdHover = p !== 'idle'
      fwdSocials = p === 'socials'
      fwdAgent = p === 'agent'
    } else {
      let newHovered = distanceFromCenter < sphereRadius * 1.5
      if (hoverProgress.current > ANIMATION.hoverThreshold) {
        const nearAnyOrb = orbCenters3D.some(c => targetVec.distanceTo(c) < LEVEL1.hoverRadius)
        newHovered = newHovered || nearAnyOrb
      }
      isHovered.current = newHovered

      const subActive = socialsProgress.current > 0.02 || agentProgress.current > 0.02
      hTarget = (isHovered.current || subActive) ? 1.0 : 0.0

      const distToSocials = targetVec.distanceTo(orbCenters3D[1])
      sHovered = hoverProgress.current > ANIMATION.socialsActivation
        && distToSocials < LEVEL1.hoverRadius
        && agentProgress.current < 0.02

      const distToAgent = targetVec.distanceTo(orbCenters3D[0])
      aHoveredNow = hoverProgress.current > ANIMATION.socialsActivation
        && distToAgent < LEVEL1.hoverRadius
        && socialsProgress.current < 0.02

      fwdHover = isHovered.current
      fwdSocials = sHovered
      fwdAgent = aHoveredNow
    }

    const rm = isMobile ? 4 : 1

    const hoverRate = (hTarget === 1.0 ? ANIMATION.inRate : ANIMATION.outRate) * rm
    hoverProgress.current = advance(hoverProgress.current, hTarget, hoverRate)
    materialRef.current.uniforms.uHoverProgress.value = hoverProgress.current

    const socialsTarget = sHovered ? 1.0 : 0.0
    const socialsRate = (sHovered ? ANIMATION.inRate : ANIMATION.outRate) * rm
    socialsProgress.current = advance(socialsProgress.current, socialsTarget, socialsRate)
    materialRef.current.uniforms.uSocialsProgress.value = socialsProgress.current

    const agentTarget = aHoveredNow ? 1.0 : 0.0
    const agentRate = (aHoveredNow ? ANIMATION.inRate : ANIMATION.outRate * 0.6) * rm
    agentProgress.current = advance(agentProgress.current, agentTarget, agentRate)
    materialRef.current.uniforms.uAgentProgress.value = agentProgress.current

    materialRef.current.uniforms.uForwardFlags.value.set(
      fwdHover ? 1 : 0,
      fwdSocials ? 1 : 0,
      fwdAgent ? 1 : 0,
    )

    // Camera — consistent smootherstep easing for both sub-zooms
    const sp = socialsProgress.current
    const ease5 = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
    const spEased = ease5(sp)

    const ap = agentProgress.current
    const apEased = ease5(ap)
    const hp = hoverProgress.current

    if (sp > 0.0001) {
      camTargetVec.lerpVectors(defaultCamPos, socialsCamPos, spEased)
      state.camera.position.copy(camTargetVec)
      lookAtVec.set(
        spEased * LEVEL2_SOCIALS.zoom.lookAt[0],
        spEased * LEVEL2_SOCIALS.zoom.lookAt[1],
        0,
      )
      state.camera.lookAt(lookAtVec)
    } else if (ap > 0.0001) {
      camTargetVec.lerpVectors(defaultCamPos, agentCamPos, apEased)
      state.camera.position.copy(camTargetVec)
      lookAtVec.set(
        apEased * LEVEL2_AGENT.zoom.lookAt[0],
        apEased * LEVEL2_AGENT.zoom.lookAt[1],
        0,
      )
      state.camera.lookAt(lookAtVec)
    } else {
      state.camera.position.copy(defaultCamPos)
      state.camera.lookAt(0, 0, 0)
    }

    // --- Label visibility (direct DOM manipulation, no React re-renders) ---
    // Labels only appear when progress has snapped to exactly 1.0 — animation truly over.

    // "Lucid" title: fades out as hover begins
    if (mainTitleRef.current) {
      mainTitleRef.current.style.opacity = String(Math.max(0, 1 - hp * 5))
    }

    // Main split labels: only when hover is fully done AND no sub-zoom active
    const mainShow = hp >= 1.0 && sp === 0 && ap === 0
    mainLabelRefs.current.forEach(el => {
      if (!el) return
      el.style.opacity = mainShow ? '1' : '0'
      el.style.pointerEvents = mainShow ? 'auto' : 'none'
    })

    // Sub socials labels: only when socials zoom is fully done
    const subShow = sp >= 1.0
    subLabelRefs.current.forEach(el => {
      if (!el) return
      el.style.opacity = subShow ? '1' : '0'
      el.style.pointerEvents = subShow ? 'auto' : 'none'
    })

    // Agent label: only when agent morph is fully done
    const agentShow = ap >= 1.0
    if (agentLabelRef.current) {
      agentLabelRef.current.style.opacity = agentShow ? '1' : '0'
      agentLabelRef.current.style.pointerEvents = agentShow ? 'auto' : 'none'
    }
    if (agentGlowRef.current) {
      agentGlowRef.current.style.opacity = (agentShow && agentBtnHovered.current) ? '1' : '0'
    }

    if (isMobile && !touchActiveRef.current) {
      materialRef.current.uniforms.uPointer.value.set(999, 999, 999)
    } else {
      materialRef.current.uniforms.uPointer.value.lerp(targetVec, CURSOR.lerpRate)
    }
  })

  const showLabels = !!portalRef

  const subLabelLinks: Record<string, string> = { x: 'https://x.com/GetLucid', github: 'https://github.com/get-Lucid/Lucid', docs: '/docs' }

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-originalPosition"
            args={[originalPositions, 3]}
            count={originalPositions.length / 3}
            array={originalPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aRandom"
            args={[randoms, 1]}
            count={randoms.length}
            array={randoms}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aAgentTarget"
            args={[agentTargets, 3]}
            count={agentTargets.length / 3}
            array={agentTargets}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aAgentBrightness"
            args={[agentBrightness, 1]}
            count={agentBrightness.length}
            array={agentBrightness}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {showLabels && (
        <>
          {/* "Lucid" above main orb */}
          <Html
            position={[0, sphereRadius + 0.5, 0]}
            center
            portal={portalRef}
          >
            <div ref={mainTitleRef} style={{ opacity: 1 }}>
              <span
                className="orb-label font-light select-none whitespace-nowrap lowercase"
                style={labelStyle}
              >
                lucid
              </span>
            </div>
          </Html>

          {/* Main split labels (lucid agent, socials, dev portal) */}
          {LEVEL1.nodes.map((node, i) => {
            const isDevPortal = node.id === 'devPortal'
            return (
              <Html
                key={node.id}
                position={[node.center[0], node.center[1] + node.radius + 0.4, node.center[2]]}
                center
                portal={portalRef}
              >
                <div
                  ref={el => { mainLabelRefs.current[i] = el }}
                  style={{
                    opacity: 0,
                    transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {isDevPortal ? (
                    <a
                      href="/app"
                      className="orb-label font-light select-none whitespace-nowrap lowercase"
                      style={{ ...labelStyle, textDecoration: 'none', cursor: 'pointer' }}
                    >
                      {node.label}
                    </a>
                  ) : (
                    <span
                      className="orb-label font-light select-none whitespace-nowrap lowercase"
                      style={labelStyle}
                    >
                      {node.label}
                    </span>
                  )}
                </div>
              </Html>
            )
          })}

          {/* Sub socials labels */}
          {LEVEL2_SOCIALS.nodes.map((node, i) => {
            const href = subLabelLinks[node.id]
            return (
              <Html
                key={`sub-${node.id}`}
                position={[node.center[0], node.center[1] + node.radius + 0.25, node.center[2]]}
                center
                portal={portalRef}
              >
                <div
                  ref={el => { subLabelRefs.current[i] = el }}
                  style={{
                    opacity: 0,
                    transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: 'none',
                  }}
                >
                  {href ? (
                    <a
                      href={href}
                      {...(href.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                      className="orb-label font-light select-none whitespace-nowrap lowercase"
                      style={{
                        ...labelStyle,
                        textDecoration: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {node.label}
                    </a>
                  ) : (
                    <span
                      className="orb-label font-light select-none whitespace-nowrap lowercase"
                      style={labelStyle}
                    >
                      {node.label}
                    </span>
                  )}
                </div>
              </Html>
            )
          })}

          {/* Glow behind agent figure — offset to figure's visual center */}
          <Html
            position={[LEVEL1.nodes[0].center[0] + 0.44, LEVEL1.nodes[0].center[1] - 0.6, 0]}
            center
            portal={portalRef}
          >
            <div
              ref={agentGlowRef}
              style={{
                width: '280px',
                height: '350px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)',
                boxShadow: '0 0 80px rgba(255,255,255,0.06), inset 0 0 40px rgba(255,255,255,0.02)',
                opacity: 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: 'none',
              }}
            />
          </Html>

          {/* "Portal" above agent figure — links to Lucid Agent X account */}
          <Html
            position={[LEVEL1.nodes[0].center[0] + 0.44, LEVEL1.nodes[0].center[1] + 2.1, 0]}
            center
            portal={portalRef}
          >
            <div
              ref={agentLabelRef}
              style={{
                opacity: 0,
                transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'none',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <a
                href="https://x.com/Lucid_Agent"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => { agentBtnHovered.current = true }}
                onMouseLeave={() => { agentBtnHovered.current = false }}
                className="coming-soon-btn group relative cursor-pointer bg-transparent border-none outline-none no-underline"
                style={{ padding: '8px 16px', fontFamily: 'var(--font-geist-sans)', textDecoration: 'none' }}
              >
                <span
                  className="coming-soon-text block text-white font-light lowercase select-none whitespace-nowrap"
                  style={{
                    fontSize: isMobile ? '0.85rem' : '1.2rem',
                    transition: 'text-shadow 0.4s ease, letter-spacing 0.4s ease',
                    textShadow: '0 0 15px rgba(255,255,255,0.2)',
                    letterSpacing: isMobile ? '0.15em' : '0.3em',
                  }}
                >
                  portal
                </span>
                <span
                  className="coming-soon-underline block mx-auto mt-2"
                  style={{
                    height: '1px',
                    background: '#fff',
                    width: '0%',
                    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: 0.5,
                  }}
                />
              </a>
            </div>
          </Html>
        </>
      )}
    </>
  )
}
