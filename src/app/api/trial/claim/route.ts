import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPrivyToken, generateApiKey } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const privyId = await verifyPrivyToken(req)
  if (!privyId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { privyId },
    include: { apiKeys: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 })
  }

  const alreadyClaimed = user.apiKeys.some(k => k.isTrial)
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

  return NextResponse.json({ key: apiKey, expiresAt })
}
