import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPrivyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const privyId = await verifyPrivyToken(req)
  if (!privyId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const existing = await prisma.user.findUnique({ where: { privyId } })
  if (existing) {
    return NextResponse.json({ user: { id: existing.id } })
  }

  const user = await prisma.user.create({
    data: { privyId },
  })

  return NextResponse.json({ user: { id: user.id } })
}
