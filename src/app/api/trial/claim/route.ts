import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPrivyToken, generateApiKey } from '@/lib/auth'

export async function POST(req: NextRequest) {
  // #region agent log
  console.log('[DEBUG-8b79ab] trial/claim: entry')
  // #endregion
  const privyId = await verifyPrivyToken(req)
  // #region agent log
  console.log('[DEBUG-8b79ab] trial/claim: auth result', { privyId: privyId ? 'valid' : 'null' })
  // #endregion
  if (!privyId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { privyId },
      include: { apiKeys: true },
    })
    // #region agent log
    console.log('[DEBUG-8b79ab] trial/claim: user found', { userId: user?.id || 'null', keyCount: user?.apiKeys?.length, keyFields: user?.apiKeys?.[0] ? Object.keys(user.apiKeys[0]) : 'none' })
    // #endregion

    if (!user) {
      return NextResponse.json({ error: 'user not found' }, { status: 404 })
    }

    const alreadyClaimed = user.apiKeys.some(k => k.isTrial)
    // #region agent log
    console.log('[DEBUG-8b79ab] trial/claim: already claimed?', { alreadyClaimed, trialKeys: user.apiKeys.filter(k => k.isTrial).length })
    // #endregion
    if (alreadyClaimed) {
      return NextResponse.json({ error: 'trial already claimed' }, { status: 409 })
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const apiKey = await prisma.apiKey.create({
      data: {
        key: generateApiKey(),
        name: '24h trial',
        isTrial: true,
        expiresAt,
        userId: user.id,
      },
    })
    // #region agent log
    console.log('[DEBUG-8b79ab] trial/claim: key created', { keyId: apiKey.id, isTrial: apiKey.isTrial, expiresAt: apiKey.expiresAt })
    // #endregion

    return NextResponse.json({ key: apiKey, expiresAt })
  } catch (err: unknown) {
    // #region agent log
    console.error('[DEBUG-8b79ab] trial/claim: ERROR', { message: (err as Error)?.message, stack: (err as Error)?.stack?.slice(0, 300) })
    // #endregion
    return NextResponse.json({ error: 'internal error', detail: (err as Error)?.message }, { status: 500 })
  }
}
