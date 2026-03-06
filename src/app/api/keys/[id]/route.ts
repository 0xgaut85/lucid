import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPrivyToken } from '@/lib/auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const privyId = await verifyPrivyToken(req)
  if (!privyId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const user = await prisma.user.findUnique({ where: { privyId } })
  if (!user) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 })
  }

  const apiKey = await prisma.apiKey.findUnique({ where: { id } })
  if (!apiKey || apiKey.userId !== user.id) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  await prisma.apiKey.update({
    where: { id },
    data: { active: false },
  })

  return NextResponse.json({ success: true })
}
