import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function authenticateApiKey(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const apiKey = authHeader.slice(7)
  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: { include: { subscription: true } } },
  })

  if (!key || !key.active) return null

  const sub = key.user.subscription
  const hasActiveSub = sub?.status === 'active' &&
    sub?.expiresAt &&
    new Date(sub.expiresAt) > new Date()

  if (!hasActiveSub) return null

  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsed: new Date() },
  })

  return key.userId
}

export async function POST(req: NextRequest) {
  const userId = await authenticateApiKey(req)
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized or subscription expired' }, { status: 401 })
  }

  const body = await req.json()
  const { query, type } = body

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'missing query' }, { status: 400 })
  }

  // type can be: 'docs', 'package', 'fact', 'api_ref'
  const searchType = type || 'docs'

  try {
    const results = await performSearch(query, searchType)
    return NextResponse.json({ results, query, type: searchType })
  } catch {
    return NextResponse.json({ error: 'search failed' }, { status: 500 })
  }
}

async function performSearch(query: string, type: string) {
  // Real-time search implementation stub.
  // In production, this calls external APIs (web search, package registries, doc sites).
  // The MCP server in the plugin calls this endpoint.

  const encodedQuery = encodeURIComponent(query)

  switch (type) {
    case 'package': {
      const res = await fetch(`https://registry.npmjs.org/${encodedQuery}`)
      if (res.ok) {
        const data = await res.json()
        return {
          name: data.name,
          latestVersion: data['dist-tags']?.latest,
          description: data.description,
          homepage: data.homepage,
          repository: data.repository?.url,
          modified: data.time?.modified,
        }
      }
      return { error: 'package not found', query }
    }

    case 'docs':
    case 'api_ref':
    case 'fact':
    default:
      return {
        message: `Search for "${query}" (type: ${type}). Connect your preferred search provider (Tavily, Serper, etc.) via SEARCH_API_KEY env var for live results.`,
        query,
        type,
        timestamp: new Date().toISOString(),
      }
  }
}
