'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ApiKeyData {
  id: string
  key: string
  name: string
  active: boolean
  createdAt: string
  lastUsed: string | null
}

interface SubscriptionData {
  status: string
  chain: string | null
  expiresAt: string | null
}

export default function AppPage() {
  const { ready, authenticated, login, logout, user, getAccessToken } = usePrivy()

  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([])
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [creatingKey, setCreatingKey] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [showNewKeyInput, setShowNewKeyInput] = useState(false)
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())

  const fetchData = useCallback(async () => {
    try {
      const token = await getAccessToken()
      if (!token) return

      const headers = { Authorization: `Bearer ${token}` }

      const [keysRes, subRes] = await Promise.all([
        fetch('/api/keys', { headers }),
        fetch('/api/subscribe/status', { headers }),
      ])

      if (keysRes.ok) {
        const data = await keysRes.json()
        setApiKeys(data.keys || [])
      }
      if (subRes.ok) {
        const data = await subRes.json()
        setSubscription(data.subscription || null)
      }
    } catch {
      // silently fail on fetch errors
    } finally {
      setLoading(false)
    }
  }, [getAccessToken])

  useEffect(() => {
    if (!authenticated || !ready) return
    const syncAndFetch = async () => {
      try {
        const token = await getAccessToken()
        if (!token) return
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {
        // sync may fail if user already exists
      }
      fetchData()
    }
    syncAndFetch()
  }, [authenticated, ready, getAccessToken, fetchData])

  const createKey = async () => {
    setCreatingKey(true)
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newKeyName || 'Default' }),
      })
      if (res.ok) {
        setNewKeyName('')
        setShowNewKeyInput(false)
        await fetchData()
      }
    } finally {
      setCreatingKey(false)
    }
  }

  const revokeKey = async (id: string) => {
    const token = await getAccessToken()
    await fetch(`/api/keys/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    await fetchData()
  }

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleReveal = (id: string) => {
    setRevealedKeys(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const maskKey = (key: string) => key.slice(0, 6) + '•'.repeat(20) + key.slice(-4)

  const isSubscribed = subscription?.status === 'active' &&
    subscription?.expiresAt &&
    new Date(subscription.expiresAt) > new Date()

  if (!ready) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin" />
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center max-w-lg text-center">
          <Image src="/logo.png" alt="Lucid" width={48} height={48} className="mb-8 opacity-80" />

          <h1
            className="text-white font-light tracking-[0.3em] lowercase text-2xl mb-4"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            dev portal
          </h1>

          <p
            className="text-white/50 text-sm leading-relaxed mb-12 max-w-md"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            An intelligence layer grounding autonomous agents in verified, real-time knowledge at scale.
          </p>

          <button
            onClick={login}
            className="group relative cursor-pointer bg-transparent border border-white/20 hover:border-white/50 transition-all duration-500 px-10 py-3 rounded-none"
          >
            <span
              className="text-white font-light lowercase tracking-[0.25em] text-sm"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              sign in
            </span>
          </button>

          <p className="text-white/30 text-xs mt-6 tracking-wider" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            google &middot; email &middot; wallet
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 sm:px-10 sm:py-6">
          <Link href="/" className="text-white/40 hover:text-white/70 transition-colors text-xs font-sans font-light tracking-wider">
            &larr; home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Lucid" width={28} height={28} className="opacity-70" />
            <span
              className="text-white/80 font-light tracking-[0.25em] lowercase text-sm"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              dev portal
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white/40 hover:text-white/60 transition-colors text-xs tracking-wider lowercase">
              home
            </Link>
            <button
              onClick={logout}
              className="text-white/40 hover:text-white/60 transition-colors text-xs tracking-wider lowercase cursor-pointer"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              sign out
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-12">
          <p className="text-white/40 text-xs tracking-wider lowercase mb-1" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            signed in as
          </p>
          <p className="text-white/70 text-sm font-light" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            {user?.email?.address || user?.wallet?.address?.slice(0, 8) + '...' + user?.wallet?.address?.slice(-4) || user?.google?.email || 'connected'}
          </p>
        </div>

        {/* Subscription Status */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white/60 text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              subscription
            </h2>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isSubscribed ? 'bg-green-400' : 'bg-white/20'}`} />
              <span className="text-white/50 text-xs tracking-wider lowercase" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                {isSubscribed ? 'active' : 'inactive'}
              </span>
            </div>
          </div>

          <div className="border border-white/10 p-6">
            {isSubscribed ? (
              <div>
                <p className="text-white/50 text-xs mb-1" style={{ fontFamily: 'var(--font-geist-sans)' }}>expires</p>
                <p className="text-white/80 text-sm font-light" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  {new Date(subscription!.expiresAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-white/30 text-xs mt-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  paid on {subscription!.chain}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-white/50 text-sm mb-4" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  20 USDC / month &mdash; payable on Solana or Base
                </p>
                <a
                  href="#subscribe"
                  className="inline-block border border-white/20 hover:border-white/50 transition-all px-6 py-2 text-white/70 text-xs tracking-[0.2em] lowercase"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('subscribe-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  subscribe
                </a>
              </div>
            )}
          </div>
        </section>

        {/* API Keys */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white/60 text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              api keys
            </h2>
            {!showNewKeyInput && (
              <button
                onClick={() => setShowNewKeyInput(true)}
                className="text-white/40 hover:text-white/60 transition-colors text-xs tracking-wider lowercase cursor-pointer"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                + new key
              </button>
            )}
          </div>

          {showNewKeyInput && (
            <div className="border border-white/10 p-4 mb-4 flex items-center gap-3">
              <input
                type="text"
                placeholder="key name (optional)"
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                className="flex-1 bg-transparent border border-white/10 px-3 py-2 text-white/80 text-xs tracking-wider outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
                onKeyDown={e => e.key === 'Enter' && createKey()}
              />
              <button
                onClick={createKey}
                disabled={creatingKey}
                className="border border-white/20 hover:border-white/50 transition-all px-4 py-2 text-white/70 text-xs tracking-wider lowercase cursor-pointer disabled:opacity-30"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                {creatingKey ? '...' : 'create'}
              </button>
              <button
                onClick={() => { setShowNewKeyInput(false); setNewKeyName('') }}
                className="text-white/30 hover:text-white/50 transition-colors text-xs cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}

          {loading ? (
            <div className="border border-white/10 p-8 flex items-center justify-center">
              <div className="w-4 h-4 border border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="border border-white/10 p-8 text-center">
              <p className="text-white/30 text-xs tracking-wider" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                no api keys yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {apiKeys.map(key => (
                <div key={key.id} className="border border-white/10 p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-xs mb-1" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                      {key.name}
                    </p>
                    <p className="text-white/80 text-xs truncate" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                      {revealedKeys.has(key.id) ? key.key : maskKey(key.key)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleReveal(key.id)}
                      className="text-white/30 hover:text-white/60 transition-colors text-xs cursor-pointer px-2 py-1"
                      title={revealedKeys.has(key.id) ? 'hide' : 'reveal'}
                    >
                      {revealedKeys.has(key.id) ? 'hide' : 'show'}
                    </button>
                    <button
                      onClick={() => copyKey(key.key, key.id)}
                      className="text-white/30 hover:text-white/60 transition-colors text-xs cursor-pointer px-2 py-1"
                    >
                      {copiedId === key.id ? 'copied' : 'copy'}
                    </button>
                    <button
                      onClick={() => revokeKey(key.id)}
                      className="text-red-400/50 hover:text-red-400 transition-colors text-xs cursor-pointer px-2 py-1"
                    >
                      revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Subscribe Section */}
        {!isSubscribed && (
          <section id="subscribe-section" className="mb-14">
            <h2 className="text-white/60 text-xs tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              subscribe with usdc
            </h2>
            <SubscribePanel
              getAccessToken={getAccessToken}
              onSuccess={fetchData}
            />
          </section>
        )}

        {/* Install Instructions */}
        <section className="mb-14">
          <h2 className="text-white/60 text-xs tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            install lucid
          </h2>
          <div className="border border-white/10 p-6 space-y-4">
            <div>
              <p className="text-white/40 text-xs mb-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>1. add the marketplace</p>
              <code className="block text-white/70 text-xs px-3 py-2 bg-white/5" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                /plugin marketplace add &lt;org&gt;/lucid-plugin
              </code>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>2. install the plugin</p>
              <code className="block text-white/70 text-xs px-3 py-2 bg-white/5" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                /plugin install lucid@&lt;org&gt;/lucid-plugin
              </code>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>3. set your api key</p>
              <code className="block text-white/70 text-xs px-3 py-2 bg-white/5" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                export LUCID_API_KEY=lk_xxxxxxxxxxxxxxxx
              </code>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-between pt-8 border-t border-white/5">
          <Link href="/terms" className="text-white/30 hover:text-white/50 transition-colors text-xs tracking-wider">
            Terms
          </Link>
          <span className="text-white/20 text-xs tracking-wider flex items-center gap-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            &copy; 2026 Lucid
          </span>
          <Link href="/legal" className="text-white/30 hover:text-white/50 transition-colors text-xs tracking-wider">
            Legal
          </Link>
        </div>
      </div>
    </main>
  )
}

function SubscribePanel({
  getAccessToken,
  onSuccess,
}: {
  getAccessToken: () => Promise<string | null>
  onSuccess: () => void
}) {
  const [chain, setChain] = useState<'solana' | 'base'>('solana')
  const [txHash, setTxHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const USDC_ADDRESSES = {
    solana: process.env.NEXT_PUBLIC_USDC_RECEIVE_ADDRESS_SOL || 'configure in env',
    base: process.env.NEXT_PUBLIC_USDC_RECEIVE_ADDRESS_BASE || 'configure in env',
  }

  const submit = async () => {
    if (!txHash.trim()) {
      setError('enter a transaction hash')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txHash: txHash.trim(), chain }),
      })
      if (res.ok) {
        setSuccess(true)
        setTxHash('')
        onSuccess()
      } else {
        const data = await res.json()
        setError(data.error || 'verification failed')
      }
    } catch {
      setError('network error')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="border border-green-400/20 p-6 text-center">
        <p className="text-green-400/80 text-sm" style={{ fontFamily: 'var(--font-geist-sans)' }}>
          subscription activated
        </p>
      </div>
    )
  }

  return (
    <div className="border border-white/10 p-6 space-y-6">
      <div>
        <p className="text-white/50 text-sm mb-4" style={{ fontFamily: 'var(--font-geist-sans)' }}>
          send <span className="text-white/80">20 USDC</span> to the address below, then paste the transaction hash.
        </p>

        <div className="flex gap-2 mb-4">
          {(['solana', 'base'] as const).map(c => (
            <button
              key={c}
              onClick={() => setChain(c)}
              className={`px-4 py-1.5 text-xs tracking-wider lowercase transition-all cursor-pointer border ${
                chain === c
                  ? 'border-white/40 text-white/80'
                  : 'border-white/10 text-white/30 hover:border-white/20'
              }`}
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-white/40 text-xs mb-1" style={{ fontFamily: 'var(--font-geist-sans)' }}>send to</p>
          <p
            className="text-white/70 text-xs break-all bg-white/5 px-3 py-2 select-all cursor-text"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {USDC_ADDRESSES[chain]}
          </p>
        </div>
      </div>

      <div>
        <p className="text-white/40 text-xs mb-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>transaction hash</p>
        <input
          type="text"
          placeholder="paste tx hash here..."
          value={txHash}
          onChange={e => setTxHash(e.target.value)}
          className="w-full bg-transparent border border-white/10 px-3 py-2 text-white/80 text-xs tracking-wider outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        />
      </div>

      {error && (
        <p className="text-red-400/70 text-xs" style={{ fontFamily: 'var(--font-geist-sans)' }}>
          {error}
        </p>
      )}

      <button
        onClick={submit}
        disabled={submitting}
        className="w-full border border-white/20 hover:border-white/50 transition-all py-2.5 text-white/70 text-xs tracking-[0.2em] lowercase cursor-pointer disabled:opacity-30"
        style={{ fontFamily: 'var(--font-geist-sans)' }}
      >
        {submitting ? 'verifying...' : 'verify & activate'}
      </button>
    </div>
  )
}
