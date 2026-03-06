import { NextRequest } from 'next/server'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || ''

export async function verifyPrivyToken(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)

  try {
    const res = await fetch('https://auth.privy.io/api/v1/token/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'privy-app-id': PRIVY_APP_ID,
        Authorization: `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
      },
      body: JSON.stringify({ token }),
    })

    if (!res.ok) return null

    const data = await res.json()
    return data.userId || data.sub || null
  } catch {
    return null
  }
}

export function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = 'lk_'
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  for (const b of bytes) {
    key += chars[b % chars.length]
  }
  return key
}
