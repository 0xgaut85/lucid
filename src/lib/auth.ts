import { NextRequest } from 'next/server'
import { PrivyClient } from '@privy-io/server-auth'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || ''

const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET)

export async function verifyPrivyToken(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization')
  // #region agent log
  console.log('[DEBUG-8b79ab] verifyPrivyToken: start', { hasAuthHeader: !!authHeader, appIdSet: !!PRIVY_APP_ID, secretSet: !!PRIVY_APP_SECRET })
  // #endregion
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)

  try {
    const verifiedClaims = await privy.verifyAuthToken(token)
    // #region agent log
    console.log('[DEBUG-8b79ab] verifyPrivyToken: verified', { userId: verifiedClaims.userId })
    // #endregion
    return verifiedClaims.userId || null
  } catch (err: unknown) {
    // #region agent log
    console.error('[DEBUG-8b79ab] verifyPrivyToken: FAILED', { message: (err as Error)?.message })
    // #endregion
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
