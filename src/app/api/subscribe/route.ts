import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPrivyToken } from '@/lib/auth'
import { verifySolanaPayment, verifyBasePayment } from '@/lib/verify-payment'

export async function POST(req: NextRequest) {
  // #region agent log
  console.log('[DEBUG-8b79ab] subscribe/POST: entry')
  // #endregion
  const privyId = await verifyPrivyToken(req)
  if (!privyId) {
    // #region agent log
    console.log('[DEBUG-8b79ab] subscribe/POST: unauthorized')
    // #endregion
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { privyId } })
    if (!user) {
      return NextResponse.json({ error: 'user not found' }, { status: 404 })
    }

    const body = await req.json()
    const { txHash, chain } = body
    // #region agent log
    console.log('[DEBUG-8b79ab] subscribe/POST: payload', { txHash: txHash?.slice(0, 20), chain })
    // #endregion

    if (!txHash || !chain || !['solana', 'base'].includes(chain)) {
      return NextResponse.json({ error: 'invalid request', detail: 'txHash and chain (solana|base) required' }, { status: 400 })
    }

    const existingSub = await prisma.subscription.findFirst({ where: { txHash } })
    if (existingSub) {
      if (existingSub.userId === user.id) {
        return NextResponse.json({ success: true, expiresAt: existingSub.expiresAt, alreadyApplied: true })
      }
      return NextResponse.json({ error: 'transaction already used' }, { status: 400 })
    }

    let verified = false
    let verifyError: string | null = null
    try {
      if (chain === 'solana') {
        verified = await verifySolanaPayment(txHash)
      } else {
        verified = await verifyBasePayment(txHash)
      }
      // #region agent log
      console.log('[DEBUG-8b79ab] subscribe/POST: verification result', { chain, verified })
      // #endregion
    } catch (err: unknown) {
      verifyError = (err as Error)?.message || 'unknown error'
      // #region agent log
      console.error('[DEBUG-8b79ab] subscribe/POST: verification THREW', { chain, error: verifyError, stack: (err as Error)?.stack?.slice(0, 300) })
      // #endregion
      return NextResponse.json({ error: 'verification failed', detail: verifyError }, { status: 500 })
    }

    if (!verified) {
      // #region agent log
      console.log('[DEBUG-8b79ab] subscribe/POST: NOT verified', { chain, txHash: txHash?.slice(0, 20) })
      // #endregion
      return NextResponse.json({ error: 'payment not verified', detail: `${chain} tx ${txHash} did not match expected USDC transfer of 20+ to configured address` }, { status: 400 })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: { userId: user.id, status: 'active', txHash, chain, expiresAt },
      update: { status: 'active', txHash, chain, expiresAt },
    })

    // #region agent log
    console.log('[DEBUG-8b79ab] subscribe/POST: SUCCESS', { expiresAt })
    // #endregion
    return NextResponse.json({ success: true, expiresAt })
  } catch (err: unknown) {
    // #region agent log
    console.error('[DEBUG-8b79ab] subscribe/POST: OUTER ERROR', { message: (err as Error)?.message, stack: (err as Error)?.stack?.slice(0, 300) })
    // #endregion
    return NextResponse.json({ error: 'internal error', detail: (err as Error)?.message }, { status: 500 })
  }
}
