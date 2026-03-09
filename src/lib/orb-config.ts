export interface OrbNode {
  id: string
  label: string
  center: [number, number, number]
  radius: number
  labelColor: 'black' | 'white'
  labelPosition: 'center' | 'above' | 'below'
}

export interface OrbGroup {
  id: string
  nodes: OrbNode[]
  links: boolean
  zoom: { position: [number, number, number]; lookAt: [number, number, number] }
  linkConfig: { threshold: number; noise: number; sizeFactor: number }
  hoverRadius: number
  labelOffset: number
}

export const ROOT_ORB = {
  radius: 3.6,
  particles: { dense: 50000, core: 50000, shell: 50000 },
} as const

export const LEVEL1: OrbGroup = {
  id: 'main',
  nodes: [
    { id: 'lucidAgent', label: 'lucid agent', center: [-3.8, 2.5, 0], radius: 2.2, labelColor: 'white', labelPosition: 'above' },
    { id: 'socials', label: 'socials', center: [3.8, 2.5, 0], radius: 2.2, labelColor: 'white', labelPosition: 'above' },
    { id: 'devPortal', label: 'dev portal', center: [0, -3.0, 0], radius: 2.2, labelColor: 'white', labelPosition: 'above' },
  ],
  links: false,
  zoom: { position: [0, 0, 15], lookAt: [0, 0, 0] },
  linkConfig: { threshold: 0, noise: 0, sizeFactor: 0 },
  hoverRadius: 3.5,
  labelOffset: 3.2,
}

export const LEVEL2_SOCIALS: OrbGroup = {
  id: 'socials-children',
  nodes: [
    { id: 'x', label: '@getlucid', center: [1.8, 3.6, 0], radius: 1.0, labelColor: 'white', labelPosition: 'above' },
    { id: 'github', label: 'github', center: [5.8, 3.6, 0], radius: 1.0, labelColor: 'white', labelPosition: 'above' },
    { id: 'docs', label: 'docs', center: [3.8, 0.6, 0], radius: 1.0, labelColor: 'white', labelPosition: 'above' },
  ],
  links: true,
  zoom: { position: [3.8, 2.2, 7], lookAt: [3.8, 2.2, 0] },
  linkConfig: { threshold: 0.055, noise: 0.008, sizeFactor: 0.3 },
  hoverRadius: 3.5,
  labelOffset: 1.5,
}

export const LEVEL2_AGENT = {
  id: 'agent',
  zoom: { position: [-3.8, 2.5, 7], lookAt: [-3.8, 2.5, 0] },
}

export const CURSOR = {
  baseRadius: 2.5,
  pushStrength: 0.6,
  lerpRate: 0.035,
  referenceCameraZ: 15,
} as const

export const ANIMATION = {
  inRate: 0.001875,
  outRate: 0.004375,
  dispersion: 1.8,
  linkDispersion: 0.3,
  hoverThreshold: 0.3,
  socialsActivation: 0.4,
  labelShowThreshold: 0.5,
  subLabelShowThreshold: 0.55,
} as const

export const SPLIT_DIRS = {
  topLeft: [-0.7, 0.7, 0] as [number, number, number],
  topRight: [0.7, 0.7, 0] as [number, number, number],
  bottom: [0, -1, 0] as [number, number, number],
} as const
