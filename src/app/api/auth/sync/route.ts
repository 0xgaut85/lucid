import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPrivyToken, generateApiKey } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const privyId = await verifyPrivyToken(req)
  if (!privyId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const existing = await prisma.user.findUnique({ where: { privyId } })
  if (existing) {
    return NextResponse.json({ user: { id: existing.id }, isNew: false })
  }

  // New user — create account + 24h trial key atomically
  const trialExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const user = await prisma.user.create({
    data: {
      privyId,
      apiKeys: {
        create: {
          key: generateApiKey(),
          name: '24h trial',
          isTrial: true,
          expiresAt: trialExpiresAt,
        },
      },
    },
  })

  return NextResponse.json({ user: { id: user.id }, isNew: true, trialExpiresAt })
}
