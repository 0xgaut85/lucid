import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPrivyToken } from '@/lib/auth'
import { verifySolanaPayment, verifyBasePayment } from '@/lib/verify-payment'

export async function POST(req: NextRequest) {
  const privyId = await verifyPrivyToken(req)
  if (!privyId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { privyId } })
  if (!user) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 })
  }

  const body = await req.json()
  const { txHash, chain } = body

  if (!txHash || !chain || !['solana', 'base'].includes(chain)) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }

  const existingSub = await prisma.subscription.findFirst({
    where: { txHash },
  })
  if (existingSub) {
    return NextResponse.json({ error: 'transaction already used' }, { status: 400 })
  }

  let verified = false
  try {
    if (chain === 'solana') {
      verified = await verifySolanaPayment(txHash)
    } else {
      verified = await verifyBasePayment(txHash)
    }
  } catch {
    return NextResponse.json({ error: 'verification failed' }, { status: 500 })
  }

  if (!verified) {
    return NextResponse.json({ error: 'payment not verified' }, { status: 400 })
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      status: 'active',
      txHash,
      chain,
      expiresAt,
    },
    update: {
      status: 'active',
      txHash,
      chain,
      expiresAt,
    },
  })

  return NextResponse.json({ success: true, expiresAt })
}
