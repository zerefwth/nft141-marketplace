import '@styles/globals.css'
import Layout from '@components/Layout'
import type { AppProps } from 'next/app'
import { initContract } from '../libraries/blockchain/near/utils';

function MyApp({ Component, pageProps }: AppProps) {
  if (typeof window !== "undefined") {
    window.nearInitPromise = initContract()
      .catch(console.error)
  }

  return (
    <Layout>
        <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
