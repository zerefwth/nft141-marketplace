import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { getConfig } from './config';

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near, null)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.factoryContract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['getAllPairsInfo', 'getPairAddressByIndex'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['nft141Pair'],
  })

  window.nftContract = await new Contract(window.walletConnection.account(), 'nft.gadillac.testnet', {
    viewMethods: ['nft_token', 'nft_tokens_for_owner'],
    changeMethods: ['nft_mint', 'nft_approve', 'nft_transfer'],
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export async function getPairContract(address: String) {
  return await new Contract(window.walletConnection.account(), address.toLowerCase(), {
    viewMethods: ['get_infos', 'ft_balance_of', 'ft_total_supply', 'get_nft_contract_address'],
    changeMethods: ['multi_nft_deposits', 'swap171', 'withdraw', 'batch_withdraw']
  })
}

export async function getNFTContract(address: String) {
  return await new Contract(window.walletConnection.account(), address.toLowerCase(), {
    viewMethods: ['nft_token', 'nft_tokens_for_owner'],
    changeMethods: ['nft_mint', 'nft_approve', 'nft_transfer']
  })
}
