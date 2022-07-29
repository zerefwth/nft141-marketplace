import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import { submitVault } from '@pages/api/singleVault';
import Web3Modal from 'web3modal'

const client = ipfsHttpClient({url: 'https://ipfs.infura.io:5001/api/v0'})

// import {
//   nftaddress, nftmarketaddress
// } from '@cache/deploy'

// import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
// import Market from '../artifacts/contracts/Market.sol/Market.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [formInput, updateFormInput] = useState({ name: '', symbol: '', nftAddress: '' })
  const router = useRouter()

  async function onChange(e: any) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }


  async function createVault() {
    const { name, symbol, nftAddress } = formInput
    if (!name || !symbol || !nftAddress || !fileUrl) return
    /* first, upload to IPFS */
    try {
      submitVault(name, symbol, nftAddress, fileUrl)
    } catch (error) {
      console.log('Error submit file: ', error)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full flex flex-col pb-12">
        <input
          placeholder="Vault Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Vault Symbol"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, symbol: e.target.value })}
        />
        <input
          placeholder="NFT Origin Address"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, nftAddress: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={createVault} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
          Review & Create Vault
        </button>
      </div>
    </div>
  )
}
