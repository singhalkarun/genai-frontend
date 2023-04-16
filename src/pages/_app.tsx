import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './api/apollo'
import getClient from './api/apollo'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={getClient("findtheflat.online", "GenAi@Contlo")}>
   <Component {...pageProps} />
   </ApolloProvider>
  )
}
