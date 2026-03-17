import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Base Mini NFT',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [base],
  ssr: true,
})
