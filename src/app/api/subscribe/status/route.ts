import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPrivyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const privyId = await verifyPrivyToken(req)
  if (!privyId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { privyId },
    include: { subscription: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 })
  }

  return NextResponse.json({
    subscription: user.subscription
      ? {
          status: user.subscription.status,
          chain: user.subscription.chain,
          expiresAt: user.subscription.expiresAt?.toISOString() || null,
        }
      : null,
  })
}
