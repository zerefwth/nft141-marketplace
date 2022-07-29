import { providers, ethers } from 'ethers'
import Head from 'next/head'
import { useCallback, useEffect, useState, useReducer } from 'react'
import ConnectWalletButton from '@components/primitives/ConnectWalletButton';
import { web3Modal, initialState, reducer } from '@libraries/blockchain/walletConnector'
import { signMessage } from '@libraries/blockchain/signatures'
import { login, logout } from '@libraries/blockchain/near/utils'



export const ConnectWallet = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [nearLoggedIn, setNearAccountState] = useState(false)
  const { provider, web3Provider } = state



  const connect = useCallback(async function() {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    // const provider = await web3Modal.connect()

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    // const web3Provider = new providers.Web3Provider(provider)

    // const signer = web3Provider.getSigner()
    // const address = await signer.getAddress()

    // const network = await web3Provider.getNetwork()

    // console.log(network.chainId);

    // dispatch({
    //   type: 'SET_WEB3_PROVIDER',
    //   provider,
    //   web3Provider,
    //   address,
    //   // chainId: network.chainId,
    // })

    if (window.walletConnection) {
      login();
    }
  }, [])




  const disconnect = useCallback(
    async function() {
      // await web3Modal.clearCachedProvider()
      // if (provider?.disconnect && typeof provider.disconnect === 'function') {
      //   await provider.disconnect()
      // }
      // dispatch({
      //   type: 'RESET_WEB3_PROVIDER',
      // })
      if (window.walletConnection) {
        logout();
      }
    },
    []
  )

  useEffect(() => {
    if (window.walletConnection) {
      setNearAccountState(window.walletConnection.isSignedIn())
    }
  })

  // Auto connect to the cached provider
  /*
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])
  */

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  /*
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts)
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        })
      }

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload()
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error)
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect])
  */


  return (
    <>
      {nearLoggedIn ? (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="button" onClick={disconnect}>
          Disconnect
        </button>
      ) : (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="button" onClick={connect}>
          Connect Wallet
        </button>
      )}
    </>
  )
}

export default ConnectWallet
