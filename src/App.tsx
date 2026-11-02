import { useState } from 'react'
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'
import './App.css'

function App() {
  const [account, setAccount] = useState<string>("")
  const [chainId, setChainId] = useState<number | null>(null)

  async function connect() {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this app.")
      return
    }
    try {
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      })
      const [address] = await walletClient.requestAddresses()
      setAccount(address)
      setChainId(await walletClient.getChainId())
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main>
      <h1>MultiSigWallet</h1>

      {!account && <button onClick={connect}>Connect Wallet</button>}

      {account && <p>Connected account: {account}</p>}

      {chainId !== null && chainId !== sepolia.id && (
        <p>Wrong network. Please switch MetaMask to Sepolia.</p>
      )}
    </main>
  )
}

export default App