import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { apiKey } = body

  if (!apiKey || typeof apiKey !== 'string') {
    return NextResponse.json({ valid: false, error: 'missing api key' }, { status: 400 })
  }

  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: { include: { subscription: true } } },
  })

  if (!key || !key.active) {
    return NextResponse.json({ valid: false, error: 'invalid api key' }, { status: 401 })
  }

  const sub = key.user.subscription
  const hasActiveSub = sub?.status === 'active' &&
    sub?.expiresAt &&
    new Date(sub.expiresAt) > new Date()

  if (!hasActiveSub) {
    return NextResponse.json({ valid: false, error: 'subscription expired' }, { status: 403 })
  }

  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsed: new Date() },
  })

  return NextResponse.json({ valid: true, userId: key.userId })
}
