import React, { useEffect, useState } from 'react';
import Spinner from '@components/primitives/Spinner';
import { loadVaults } from '@pages/api/loadVaults';
import Link from 'next/link';

function Vaults() {
  const [items, setItems] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadVaults().then(function(result) {
      setItems(result)
      setLoading(false)
    })
  }, [])

  if (loading) return <Spinner />;

  if (items.length == 0) return <h1>No items for sale</h1>;

  // if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {items.map((nft: any, i: number) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} />
              <div className="p-4">
                <p style={{ height: '64px' }} className="text-2xl font-semibold">
                  {nft.name}
                </p>
                <div style={{ height: '70px', overflow: 'hidden' }}>
                  <p className="text-gray-400">{nft.symbol}</p>
                    <p style={{ height: '48px' }} className="text-green-500">
                      <Link href={"/vault/" + i}>
                        Open Vault
                      </Link>
                    </p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">{nft.supply} supply</p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default Vaults;
