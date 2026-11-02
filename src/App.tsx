import { useEffect, useState } from 'react'
import { createWalletClient, custom, formatEther } from 'viem'
import { sepolia } from 'viem/chains'
import { publicClient } from './client'
import { ACCOUNT_ADDRESS, abi } from './config'
import './App.css'

function App() {
  const [account, setAccount] = useState<string>("")
  const [chainId, setChainId] = useState<number | null>(null)

  const [owners, setOwners] = useState<readonly string[]>([])
  const [required, setRequired] = useState<bigint | null>(null)
  const [nonce, setNonce] = useState<bigint | null>(null)
  const [deposit, setDeposit] = useState<bigint | null>(null)

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

  useEffect(() => {
    async function loadData() {
      try {
        const [owners, required, nonce, deposit] = await Promise.all([
          publicClient.readContract({
            address: ACCOUNT_ADDRESS,
            abi,
            functionName: 'getOwners',
          }),
          publicClient.readContract({
            address: ACCOUNT_ADDRESS,
            abi,
            functionName: 'required',
          }),
          publicClient.readContract({
            address: ACCOUNT_ADDRESS,
            abi,
            functionName: 'getNonce',
          }),
          publicClient.readContract({
            address: ACCOUNT_ADDRESS,
            abi,
            functionName: 'getDeposit',
          }),
        ])
        setOwners(owners)
        setRequired(required)
        setNonce(nonce)
        setDeposit(deposit)
      } catch (error) {
        console.error(error)
      }
    }
    loadData()
  }, [])

  return (
    <main>
      <h1>MultiSigWallet</h1>

      {!account && <button onClick={connect}>Connect Wallet</button>}
      {account && <p>Connected account: {account}</p>}
      {chainId !== null && chainId !== sepolia.id && (
        <p>Wrong network. Please switch MetaMask to Sepolia.</p>
      )}

      <h2>Account info</h2>
      <p>Address: {ACCOUNT_ADDRESS}</p>
      {required !== null && (
        <p>Required signatures: {required.toString()} of {owners.length}</p>
      )}
      {nonce !== null && <p>Nonce: {nonce.toString()}</p>}
      {deposit !== null && <p>EntryPoint deposit: {formatEther(deposit)} ETH</p>}

      <h3>Owners</h3>
      <ul>
        {owners.map((owner) => (
          <li key={owner}>{owner}</li>
        ))}
      </ul>
    </main>
  )
}

export default App