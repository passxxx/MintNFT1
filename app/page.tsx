'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useState, useEffect } from 'react'

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  '0x96336c4ceac90307c48ed808d0ee8505a3790cc2') as `0x${string}`

const ABI = [
  {
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalMinted',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintActive',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

interface Toast {
  message: string
  txHash?: string
  type: 'success' | 'error'
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const [toast, setToast] = useState<Toast | null>(null)

  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'mintPrice',
  })

  const { data: totalMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalMinted',
  })

  const { data: maxSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'maxSupply',
  })

  const { data: mintActive } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'mintActive',
  })

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  useEffect(() => {
    if (isSuccess && txHash) {
      setToast({ message: 'NFT Minted Successfully!', txHash, type: 'success' })
      setTimeout(() => setToast(null), 8000)
    }
  }, [isSuccess, txHash])

  useEffect(() => {
    if (writeError) {
      setToast({ message: writeError.message.slice(0, 80) + '...', type: 'error' })
      setTimeout(() => setToast(null), 5000)
    }
  }, [writeError])

  const handleMint = () => {
    if (!mintPrice) return
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'mint',
      value: mintPrice,
    })
  }

  const mintPriceEth = mintPrice ? formatEther(mintPrice) : '0.001'
  const isMinting = isPending || isConfirming
  const progress =
    totalMinted && maxSupply ? (Number(totalMinted) / Number(maxSupply)) * 100 : 0

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-2xl border ${
            toast.type === 'success'
              ? 'bg-[#0052FF]/20 border-[#0052FF] text-white'
              : 'bg-red-900/20 border-red-500 text-white'
          }`}
        >
          <p className="font-semibold">{toast.type === 'success' ? '🎉 ' : '❌ '}{toast.message}</p>
          {toast.txHash && (
            <a
              href={`https://basescan.org/tx/${toast.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0052FF] text-sm mt-1 block hover:underline"
            >
              View on Basescan →
            </a>
          )}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0052FF] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" />
                <circle cx="8" cy="8" r="3" fill="white" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">Base Mini NFT</span>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* NFT Card */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-[#0052FF] via-[#0041CC] to-[#001A66] flex flex-col items-center justify-center shadow-2xl shadow-[#0052FF]/20">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 left-8 w-32 h-32 rounded-full border-2 border-white" />
                <div className="absolute bottom-8 right-8 w-48 h-48 rounded-full border border-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white" />
              </div>
              <div className="relative text-center px-8">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border-2 border-white/40">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="3" />
                    <circle cx="24" cy="24" r="10" fill="white" />
                  </svg>
                </div>
                <h2 className="text-white text-3xl font-bold mb-2">Base NFT</h2>
                <p className="text-white/70 text-sm">
                  #{totalMinted ? String(Number(totalMinted) + 1).padStart(4, '0') : '0001'}
                </p>
                <div className="mt-4 px-3 py-1 rounded-full bg-white/20 text-white text-xs inline-block">
                  Base Mainnet
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/50 mb-1">
                <span>Minted</span>
                <span>{totalMinted ? Number(totalMinted).toString() : '0'} / {maxSupply ? Number(maxSupply).toString() : '1000'}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0052FF] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mint Panel */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Base Mini NFT</h1>
              <p className="text-white/60">
                Mint your unique NFT on the Base blockchain. Each NFT is permanently stored on-chain.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/50 text-xs mb-1">Mint Price</p>
                <p className="text-white text-xl font-bold">{mintPriceEth} ETH</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/50 text-xs mb-1">Total Supply</p>
                <p className="text-white text-xl font-bold">{maxSupply ? Number(maxSupply).toString() : '1000'}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/50 text-xs mb-1">Remaining</p>
                <p className="text-white text-xl font-bold">
                  {totalMinted && maxSupply
                    ? (Number(maxSupply) - Number(totalMinted)).toString()
                    : '1000'}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/50 text-xs mb-1">You Own</p>
                <p className="text-white text-xl font-bold">
                  {isConnected && balance !== undefined ? Number(balance).toString() : '-'}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${mintActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-white/60 text-sm">
                {mintActive === undefined ? 'Checking status...' : mintActive ? 'Mint is Active' : 'Mint is Paused'}
              </span>
            </div>

            {/* Mint Button */}
            {!isConnected ? (
              <div className="w-full">
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      onClick={openConnectModal}
                      className="w-full py-4 rounded-xl bg-[#0052FF] hover:bg-[#0041CC] text-white font-bold text-lg transition-colors"
                    >
                      Connect Wallet
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>
            ) : (
              <button
                onClick={handleMint}
                disabled={isMinting || !mintActive}
                className="w-full py-4 rounded-xl bg-[#0052FF] hover:bg-[#0041CC] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                {isMinting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isPending ? 'Confirm in wallet...' : 'Minting...'}
                  </>
                ) : (
                  `Mint Now — ${mintPriceEth} ETH`
                )}
              </button>
            )}

            {/* Contract link */}
            <p className="text-center text-white/30 text-xs">
              Contract:{' '}
              <a
                href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/60 transition-colors"
              >
                {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
