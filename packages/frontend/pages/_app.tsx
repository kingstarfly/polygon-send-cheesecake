import { ChakraProvider } from '@chakra-ui/react'
import {
  ChainId,
  Config,
  DAppProvider,
  Hardhat,
  Localhost,
  Mumbai,
  Polygon,
} from '@usedapp/core'
import { AppProps } from 'next/app'
import React from 'react'
import { MulticallContract } from '../artifacts/contracts/contractAddress'
import 'styles/global.scss'

const config: Config = {
  readOnlyUrls: {
    [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Localhost]: 'http://localhost:8545',
  },

  networks: [Polygon, Mumbai, Localhost, Hardhat],
  multicallAddresses: {
    [ChainId.Hardhat]: MulticallContract,
    [ChainId.Localhost]: MulticallContract,
    [ChainId.Mumbai]: MulticallContract,
    [ChainId.Polygon]: MulticallContract,
  },
}
const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <DAppProvider config={config}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </DAppProvider>
  )
}

export default MyApp
