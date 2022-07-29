import supportedChains from '@libraries/blockchain/chains'
import { IChainData } from '@libraries/blockchain/types'

// USAGE:   const chainData = getChainData(chainId)
//         {address && (
          /* <div className="grid">
            <div>
              <p className="mb-1">Network:</p>
              <p>{chainData?.name}</p>
            </div>
            <div>
              <p className="mb-1">Address:</p>
              <p>{ellipseAddress(address)}</p>
            </div>
          </div>
        )}
 */
export function getChainData(chainId?: number): IChainData | null {
  if (!chainId) {
    return null
  }
  const chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId
  )[0]

  if (!chainData) {
    throw new Error('ChainId missing or not supported')
  }

  const API_KEY = '616a04d6a51b4457b47c9cf712cf3ca1'

  if (
    chainData.rpc_url.includes('infura.io') &&
    chainData.rpc_url.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY)

    return {
      ...chainData,

    }
  }

  return chainData
}



/* USAGE:
              <div>
              <p className="mb-1">Address:</p>
              <p>{ellipseAddress(address)}</p>
            </div>
 */
export function ellipseAddress(address = '', width = 10): string {
  if (!address) {
    return ''
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`
}
