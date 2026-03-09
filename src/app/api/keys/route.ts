import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPrivyToken, generateApiKey } from '@/lib/auth'

export async function GET(req: NextRequest) {
  // #region agent log
  console.log('[DEBUG-8b79ab] keys/GET: entry')
  // #endregion
  const privyId = await verifyPrivyToken(req)
  if (!privyId) {
    // #region agent log
    console.log('[DEBUG-8b79ab] keys/GET: unauthorized')
    // #endregion
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { privyId },
      include: { apiKeys: { where: { active: true }, orderBy: { createdAt: 'desc' } } },
    })

    if (!user) {
      return NextResponse.json({ error: 'user not found' }, { status: 404 })
    }

    // #region agent log
    console.log('[DEBUG-8b79ab] keys/GET: returning', { keyCount: user.apiKeys.length, keys: user.apiKeys.map(k => ({ id: k.id, name: k.name, isTrial: k.isTrial, expiresAt: k.expiresAt })) })
    // #endregion
    return NextResponse.json({ keys: user.apiKeys })
  } catch (err: unknown) {
    // #region agent log
    console.error('[DEBUG-8b79ab] keys/GET: ERROR', { message: (err as Error)?.message })
    // #endregion
    return NextResponse.json({ error: 'internal error', detail: (err as Error)?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  // #region agent log
  console.log('[DEBUG-8b79ab] keys/POST: entry')
  // #endregion
  const privyId = await verifyPrivyToken(req)
  if (!privyId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { privyId },
      include: { subscription: true, apiKeys: { where: { active: true } } },
    })

    if (!user) {
      return NextResponse.json({ error: 'user not found' }, { status: 404 })
    }

    const hasActiveSub = user.subscription?.status === 'active' &&
      user.subscription?.expiresAt &&
      new Date(user.subscription.expiresAt) > new Date()

    const hasActiveTrial = user.apiKeys.some(
      k => k.isTrial && k.expiresAt && new Date(k.expiresAt) > new Date()
    )

    // #region agent log
    console.log('[DEBUG-8b79ab] keys/POST: access check', { hasActiveSub, hasActiveTrial, subStatus: user.subscription?.status, keyCount: user.apiKeys.length, trialKeys: user.apiKeys.filter(k => k.isTrial).map(k => ({ id: k.id, isTrial: k.isTrial, expiresAt: k.expiresAt })) })
    // #endregion

    if (!hasActiveSub && !hasActiveTrial) {
      return NextResponse.json({ error: 'active subscription or trial required' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const name = body.name || 'Default'
    const key = generateApiKey()

    const apiKey = await prisma.apiKey.create({
      data: { key, name, userId: user.id },
    })

    // #region agent log
    console.log('[DEBUG-8b79ab] keys/POST: created', { keyId: apiKey.id })
    // #endregion
    return NextResponse.json({ key: apiKey })
  } catch (err: unknown) {
    // #region agent log
    console.error('[DEBUG-8b79ab] keys/POST: ERROR', { message: (err as Error)?.message })
    // #endregion
    return NextResponse.json({ error: 'internal error', detail: (err as Error)?.message }, { status: 500 })
  }
}
