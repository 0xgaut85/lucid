import { Connection, PublicKey } from '@solana/web3.js'
import { createPublicClient, http, formatUnits } from 'viem'
import { base } from 'viem/chains'

const SOLANA_RPC = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
const BASE_RPC = process.env.BASE_RPC_URL || 'https://mainnet.base.org'
const USDC_RECEIVE_SOL = process.env.USDC_RECEIVE_ADDRESS_SOL || ''
const USDC_RECEIVE_BASE = process.env.USDC_RECEIVE_ADDRESS_BASE || ''

const USDC_MINT_SOL = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

const REQUIRED_AMOUNT = 20

export async function verifySolanaPayment(txHash: string): Promise<boolean> {
  if (!USDC_RECEIVE_SOL) return false

  const connection = new Connection(SOLANA_RPC, 'confirmed')
  const tx = await connection.getParsedTransaction(txHash, {
    maxSupportedTransactionVersion: 0,
  })

  if (!tx || tx.meta?.err) return false

  const receiverPk = new PublicKey(USDC_RECEIVE_SOL)

  for (const ix of tx.transaction.message.instructions) {
    if ('parsed' in ix && ix.program === 'spl-token') {
      const info = ix.parsed?.info
      if (!info) continue

      if (
        ix.parsed.type === 'transferChecked' &&
        info.mint === USDC_MINT_SOL &&
        info.destination
      ) {
        const destAccount = await connection.getParsedAccountInfo(
          new PublicKey(info.destination)
        )
        const destData = destAccount?.value?.data
        if (destData && 'parsed' in destData) {
          const owner = destData.parsed?.info?.owner
          if (owner === receiverPk.toBase58()) {
            const amount = parseFloat(info.tokenAmount?.uiAmountString || '0')
            if (amount >= REQUIRED_AMOUNT) return true
          }
        }
      }

      if (
        ix.parsed.type === 'transfer' &&
        info.destination
      ) {
        const destAccount = await connection.getParsedAccountInfo(
          new PublicKey(info.destination)
        )
        const destData = destAccount?.value?.data
        if (destData && 'parsed' in destData) {
          const owner = destData.parsed?.info?.owner
          const mint = destData.parsed?.info?.mint
          if (owner === receiverPk.toBase58() && mint === USDC_MINT_SOL) {
            const amount = parseFloat(info.amount || '0') / 1e6
            if (amount >= REQUIRED_AMOUNT) return true
          }
        }
      }
    }
  }

  return false
}

export async function verifyBasePayment(txHash: string): Promise<boolean> {
  if (!USDC_RECEIVE_BASE) return false

  const client = createPublicClient({
    chain: base,
    transport: http(BASE_RPC),
  })

  const receipt = await client.getTransactionReceipt({
    hash: txHash as `0x${string}`,
  })

  if (!receipt || receipt.status !== 'success') return false

  const receiverLower = USDC_RECEIVE_BASE.toLowerCase()

  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== USDC_BASE.toLowerCase()) continue

    try {
      const decoded = (() => {
        const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
        if (log.topics[0] !== transferTopic) return null
        if (!log.topics[2]) return null

        const to = '0x' + log.topics[2].slice(26)
        const value = BigInt(log.data)
        return { to, value }
      })()

      if (!decoded) continue

      if (decoded.to.toLowerCase() === receiverLower) {
        const amount = parseFloat(formatUnits(decoded.value, 6))
        if (amount >= REQUIRED_AMOUNT) return true
      }
    } catch {
      continue
    }
  }

  return false
}
