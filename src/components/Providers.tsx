'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['google', 'email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#ffffff',
          logo: '/logo.png',
          walletChainType: 'ethereum-and-solana',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
