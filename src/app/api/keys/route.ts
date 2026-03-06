import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPrivyToken, generateApiKey } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const privyId = await verifyPrivyToken(req)
  if (!privyId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { privyId },
    include: { apiKeys: { where: { active: true }, orderBy: { createdAt: 'desc' } } },
  })

  if (!user) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 })
  }

  return NextResponse.json({ keys: user.apiKeys })
}

export async function POST(req: NextRequest) {
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

  const hasActiveSub = user.subscription?.status === 'active' &&
    user.subscription?.expiresAt &&
    new Date(user.subscription.expiresAt) > new Date()

  if (!hasActiveSub) {
    return NextResponse.json({ error: 'active subscription required' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const name = body.name || 'Default'
  const key = generateApiKey()

  const apiKey = await prisma.apiKey.create({
    data: { key, name, userId: user.id },
  })

  return NextResponse.json({ key: apiKey })
}
