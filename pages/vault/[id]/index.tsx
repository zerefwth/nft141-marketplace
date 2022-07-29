import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Spinner from '@components/primitives/Spinner';
import { getSingleVault, loadVaultNfts, loadYourNfts, loadYourBalance, approveNft, depositNft, withdrawNft  } from '@pages/api/singleVault';
import Link from 'next/link';
import { PROVIDER_CONTAINER_CLASSNAME } from 'web3modal';
import { Contract } from 'near-api-js';

function Vault() {
  const [items, setItems] = useState<any>([]);
  const [yourItems, setYourItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [yourLoading, setYourLoading] = useState<boolean>(true);
  const [vaultContract, setVaultContract] = useState<Contract | null>(null);
  const [yourBalance, setYourBalance] = useState("");
  const router = useRouter()

  
  useEffect(() => {
    const { id } = router.query
    if (id) {
      getSingleVault(id as string).then(function(vault) {
        setVaultContract(vault)
        loadVaultNfts(vault).then(function(result) {
          setItems(result)
          setLoading(false)
        })
        loadYourNfts(vault).then(function(yourResult) {
          setYourItems(yourResult)
          setYourLoading(false)
        })
        loadYourBalance(vault).then(function(balanceResult) {
          setYourBalance(balanceResult)
        })
      })
    }
  }, [router.isReady])

  if (loading || yourLoading) return <Spinner />;

  if (items.length == 0 && yourItems.length == 0) return <h1>No items found</h1>;

  // if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="grid place-items-center">
      <h2>Your vToken Balance: {yourBalance}</h2>
      <div className="flex justify-center">
        <div className="px-4" style={{ maxWidth: '1600px' }}>
          <h2>Vault NFTs: </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {items.map((nft: any, i: number) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">
                    {nft.name}
                  </p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <button
                    className="w-full bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => withdrawNft(vaultContract, nft.tokenId)}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center align-center mt-20">
        <div className="px-4" style={{ maxWidth: '1600px' }}>
          <h2>Your NFTs: </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {yourItems.map((nft: any, i: number) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">
                    {nft.name}
                  </p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  { nft.approveIds[vaultContract!.contractId] 
                  ? <button
                      className="w-full bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      onClick={() => depositNft(vaultContract, nft.tokenId)}>
                      Deposit
                    </button>
                  : <button
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      onClick={() => approveNft(vaultContract, nft.tokenId)}>
                      Approve
                    </button>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4"></div>
      <Link
        href={"https://testnet.ref.finance/#wrap.testnet|" + vaultContract!.contractId}
      >
        <button
          className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-20"
          onClick={() => {}}>
          Swap your NEP-141 vToken
        </button>
      </Link>
      <Link
        href={"https://testnet.ref.finance/#wrap.testnet|" + vaultContract!.contractId}
      >
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5"
          onClick={() => {}}>
          Auction (rare-traits items)
        </button>
      </Link>
    </div>
  );
}


export default Vault;
