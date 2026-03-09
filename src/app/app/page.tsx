'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState, useEffect, useCallback, useRef } from 'react'
import { encodeFunctionData, parseAbi } from 'viem'
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
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [installTab, setInstallTab] = useState<'claude' | 'openclaw'>('claude')

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
      // silently fail
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

  const maskKey = (key: string) => key.slice(0, 6) + '\u2022'.repeat(20) + key.slice(-4)

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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
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
            <span className="text-white/40 text-xs" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {user?.email?.address || user?.wallet?.address?.slice(0, 8) + '...' + user?.wallet?.address?.slice(-4) || user?.google?.email || 'connected'}
            </span>
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

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Subscription + API Keys */}
          <div className="space-y-8">
            {/* Subscription Status */}
            <section>
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

              <div className="border border-white/10 p-5">
                {isSubscribed ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/50 text-xs mb-1" style={{ fontFamily: 'var(--font-geist-sans)' }}>expires</p>
                      <p className="text-white/80 text-sm font-light" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                        {new Date(subscription!.expiresAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <p className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                      paid on {subscription!.chain}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-white/50 text-sm" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                      20 USDC / month, payable on Solana or Base
                    </p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="border border-white/20 hover:border-white/50 transition-all px-6 py-2 text-white/70 text-xs tracking-[0.2em] lowercase cursor-pointer shrink-0 ml-4"
                      style={{ fontFamily: 'var(--font-geist-sans)' }}
                    >
                      subscribe
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* API Keys */}
            <section>
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
                <div className="border border-white/10 p-4 mb-3 flex items-center gap-3">
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
          </div>

          {/* Right column: Install Instructions */}
          <div className="space-y-8">
            <section>
              <h2 className="text-white/60 text-xs tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                install lucid
              </h2>

              {/* Tabs */}
              <div className="flex gap-0 mb-0">
                <button
                  onClick={() => setInstallTab('claude')}
                  className={`px-5 py-2.5 text-xs tracking-wider lowercase transition-all cursor-pointer border border-b-0 ${
                    installTab === 'claude'
                      ? 'border-white/20 text-white/80 bg-white/[0.02]'
                      : 'border-transparent text-white/30 hover:text-white/50'
                  }`}
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  claude code
                </button>
                <button
                  onClick={() => setInstallTab('openclaw')}
                  className={`px-5 py-2.5 text-xs tracking-wider lowercase transition-all cursor-pointer border border-b-0 ${
                    installTab === 'openclaw'
                      ? 'border-white/20 text-white/80 bg-white/[0.02]'
                      : 'border-transparent text-white/30 hover:text-white/50'
                  }`}
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  openclaw
                </button>
              </div>

              {/* Tab content */}
              <div className="border border-white/20 p-6 space-y-4 bg-white/[0.02]">
                {installTab === 'claude' ? (
                  <>
                    <div>
                      <p className="text-white/40 text-xs mb-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>1. install the plugin</p>
                      <code className="block text-white/70 text-xs px-3 py-2 bg-white/5" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                        /plugin install https://github.com/get-Lucid/Lucid
                      </code>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>2. set your api key</p>
                      <code className="block text-white/70 text-xs px-3 py-2 bg-white/5" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                        export LUCID_API_KEY=lk_xxxxxxxxxxxxxxxx
                      </code>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-white/40 text-xs mb-3" style={{ fontFamily: 'var(--font-geist-sans)' }}>install skills individually</p>
                      <div className="space-y-2">
                        {[
                          'lucid-docs',
                          'lucid-packages',
                          'lucid-grounding',
                          'lucid-api',
                          'lucid-freshness',
                        ].map(skill => (
                          <code key={skill} className="block text-white/70 text-xs px-3 py-2 bg-white/5" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                            openclaw skills install {skill}
                          </code>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>set your api key</p>
                      <code className="block text-white/70 text-xs px-3 py-2 bg-white/5" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                        export LUCID_API_KEY=lk_xxxxxxxxxxxxxxxx
                      </code>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-10 mt-12 border-t border-white/5">
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          getAccessToken={getAccessToken}
          onSuccess={() => {
            setShowPaymentModal(false)
            fetchData()
          }}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </main>
  )
}

const USDC_BASE_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const USDC_ABI = parseAbi(['function transfer(address to, uint256 amount) returns (bool)'])
const USDC_MINT_SOL = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const TOKEN_PROGRAM_ID_STR = 'TokenkegQEqfCFJ6YqXpe44SZpn2zQkJYqjC7SZqiVcM'
const ATA_PROGRAM_ID_STR = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'

function PaymentModal({
  getAccessToken,
  onSuccess,
  onClose,
}: {
  getAccessToken: () => Promise<string | null>
  onSuccess: () => void
  onClose: () => void
}) {
  const { wallets } = useWallets()
  const [chain, setChain] = useState<'solana' | 'base'>('base')
  const [status, setStatus] = useState<'idle' | 'sending' | 'verifying' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const USDC_RECEIVE_BASE = process.env.NEXT_PUBLIC_USDC_RECEIVE_ADDRESS_BASE || ''
  const USDC_RECEIVE_SOL = process.env.NEXT_PUBLIC_USDC_RECEIVE_ADDRESS_SOL || ''

  const evmWallet = wallets.find(w => w.walletClientType !== 'privy') || wallets[0]

  const hasSolanaWallet = typeof window !== 'undefined' && !!(
    (window as unknown as Record<string, unknown>).phantom as Record<string, unknown> | undefined
  )?.solana

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  const verifyAndActivate = useCallback(async (txHash: string, payChain: string) => {
    setStatus('verifying')
    const token = await getAccessToken()

    const verify = async () => {
      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ txHash, chain: payChain }),
        })
        if (res.ok) {
          if (pollingRef.current) clearInterval(pollingRef.current)
          setStatus('success')
          setTimeout(onSuccess, 1500)
          return true
        }
      } catch { /* retry */ }
      return false
    }

    const ok = await verify()
    if (!ok) {
      pollingRef.current = setInterval(async () => {
        try {
          const statusToken = await getAccessToken()
          const res = await fetch('/api/subscribe/status', {
            headers: { Authorization: `Bearer ${statusToken}` },
          })
          if (res.ok) {
            const data = await res.json()
            const sub = data.subscription
            if (sub?.status === 'active' && sub?.expiresAt && new Date(sub.expiresAt) > new Date()) {
              if (pollingRef.current) clearInterval(pollingRef.current)
              setStatus('success')
              setTimeout(onSuccess, 1500)
            }
          }
        } catch { /* keep polling */ }
      }, 5000)
    }
  }, [getAccessToken, onSuccess])

  const payWithBase = async () => {
    if (!evmWallet) {
      setError('no ethereum wallet connected')
      return
    }
    setStatus('sending')
    setError('')
    try {
      const provider = await evmWallet.getEthereumProvider()
      try {
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x2105' }] })
      } catch (switchErr: unknown) {
        if ((switchErr as { code?: number })?.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org'],
            }],
          })
        } else {
          throw switchErr
        }
      }

      const data = encodeFunctionData({
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [USDC_RECEIVE_BASE as `0x${string}`, BigInt(20_000_000)],
      })

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: evmWallet.address,
          to: USDC_BASE_CONTRACT,
          data,
        }],
      })

      await verifyAndActivate(txHash as string, 'base')
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'transaction failed'
      if (msg.includes('rejected') || msg.includes('denied') || msg.includes('cancel')) {
        setError('transaction cancelled')
      } else {
        setError(msg.length > 80 ? msg.slice(0, 80) + '...' : msg)
      }
      setStatus('error')
    }
  }

  const payWithSolana = async () => {
    setStatus('sending')
    setError('')
    try {
      const phantom = ((window as unknown as Record<string, unknown>).phantom as Record<string, unknown> | undefined)?.solana as {
        isConnected: boolean
        connect: () => Promise<{ publicKey: { toString: () => string } }>
        signAndSendTransaction: (tx: unknown) => Promise<{ signature: string }>
        publicKey: { toString: () => string } | null
      } | undefined

      if (!phantom) {
        setError('install Phantom wallet to pay with Solana')
        setStatus('error')
        return
      }

      if (!phantom.isConnected) {
        await phantom.connect()
      }

      const senderAddress = phantom.publicKey?.toString()
      if (!senderAddress) {
        setError('could not get wallet address')
        setStatus('error')
        return
      }

      const { Connection, PublicKey, Transaction, TransactionInstruction } = await import('@solana/web3.js')

      const connection = new Connection(SOLANA_RPC, 'confirmed')
      const senderPk = new PublicKey(senderAddress)
      const receiverPk = new PublicKey(USDC_RECEIVE_SOL)
      const mintPk = new PublicKey(USDC_MINT_SOL)
      const tokenProgramId = new PublicKey(TOKEN_PROGRAM_ID_STR)
      const ataProgramId = new PublicKey(ATA_PROGRAM_ID_STR)

      const [senderAta] = PublicKey.findProgramAddressSync(
        [senderPk.toBuffer(), tokenProgramId.toBuffer(), mintPk.toBuffer()],
        ataProgramId
      )
      const [receiverAta] = PublicKey.findProgramAddressSync(
        [receiverPk.toBuffer(), tokenProgramId.toBuffer(), mintPk.toBuffer()],
        ataProgramId
      )

      const amountBuffer = Buffer.alloc(9)
      amountBuffer.writeUInt8(3, 0)
      amountBuffer.writeBigUInt64LE(BigInt(20_000_000), 1)

      const transferIx = new TransactionInstruction({
        programId: tokenProgramId,
        keys: [
          { pubkey: senderAta, isSigner: false, isWritable: true },
          { pubkey: receiverAta, isSigner: false, isWritable: true },
          { pubkey: senderPk, isSigner: true, isWritable: false },
        ],
        data: amountBuffer,
      })

      const { blockhash } = await connection.getLatestBlockhash()
      const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: senderPk,
      }).add(transferIx)

      const { signature } = await phantom.signAndSendTransaction(tx)
      await verifyAndActivate(signature, 'solana')
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'transaction failed'
      if (msg.includes('rejected') || msg.includes('denied') || msg.includes('cancel')) {
        setError('transaction cancelled')
      } else {
        setError(msg.length > 80 ? msg.slice(0, 80) + '...' : msg)
      }
      setStatus('error')
    }
  }

  const handlePay = () => {
    if (chain === 'base') payWithBase()
    else payWithSolana()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-md border border-white/15 bg-[#0a0a0a] shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-white/80 text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            subscribe
          </h3>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors text-sm cursor-pointer leading-none"
          >
            &times;
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-6">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 rounded-full border border-green-400/40 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 text-sm">&#10003;</span>
              </div>
              <p className="text-green-400/80 text-sm" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                subscription activated
              </p>
            </div>
          ) : status === 'sending' ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin mx-auto" />
              <p className="text-white/50 text-xs" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                approve the transaction in your wallet...
              </p>
            </div>
          ) : status === 'verifying' ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin mx-auto" />
              <p className="text-white/50 text-xs" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                verifying on-chain...
              </p>
              <p className="text-white/30 text-[10px]" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                this may take a few seconds
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Chain selector */}
              <div>
                <p className="text-white/40 text-xs mb-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>select chain</p>
                <div className="flex gap-2">
                  {(['base', 'solana'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => { setChain(c); setError('') }}
                      className={`flex-1 px-4 py-2.5 text-xs tracking-wider lowercase transition-all cursor-pointer border ${
                        chain === c
                          ? 'border-white/40 text-white/80 bg-white/5'
                          : 'border-white/10 text-white/30 hover:border-white/20'
                      }`}
                      style={{ fontFamily: 'var(--font-geist-sans)' }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="border border-white/10 p-4 text-center">
                <p className="text-white/40 text-xs mb-1" style={{ fontFamily: 'var(--font-geist-sans)' }}>amount</p>
                <p className="text-white/90 text-lg font-light" style={{ fontFamily: 'var(--font-geist-mono)' }}>20 USDC</p>
                <p className="text-white/30 text-[10px] mt-1" style={{ fontFamily: 'var(--font-geist-sans)' }}>30 days access</p>
              </div>

              {/* Wallet info */}
              <div className="bg-white/[0.03] border border-white/10 px-4 py-3">
                {chain === 'base' ? (
                  evmWallet ? (
                    <div className="flex items-center justify-between">
                      <p className="text-white/40 text-xs" style={{ fontFamily: 'var(--font-geist-sans)' }}>wallet</p>
                      <p className="text-white/60 text-xs" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                        {evmWallet.address.slice(0, 6)}...{evmWallet.address.slice(-4)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-white/40 text-xs text-center" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                      no wallet connected
                    </p>
                  )
                ) : (
                  hasSolanaWallet ? (
                    <div className="flex items-center justify-between">
                      <p className="text-white/40 text-xs" style={{ fontFamily: 'var(--font-geist-sans)' }}>wallet</p>
                      <p className="text-white/60 text-xs" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                        phantom detected
                      </p>
                    </div>
                  ) : (
                    <p className="text-white/40 text-xs text-center" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                      install{' '}
                      <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-white/60 underline">
                        Phantom
                      </a>
                      {' '}to pay with Solana
                    </p>
                  )
                )}
              </div>

              {error && (
                <p className="text-red-400/70 text-xs" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  {error}
                </p>
              )}

              <button
                onClick={handlePay}
                disabled={(chain === 'base' && !evmWallet) || (chain === 'solana' && !hasSolanaWallet)}
                className="w-full border border-white/20 hover:border-white/50 transition-all py-3 text-white/70 text-xs tracking-[0.2em] lowercase cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                pay 20 USDC on {chain}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
