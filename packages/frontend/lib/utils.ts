import { UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import Filter from 'bad-words'

// import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'

// From https://github.com/NoahZinsmeister/web3-react/blob/v6/example/pages/index.tsx
// Parses the possible errors provided by web3-react
export function getErrorMessage(error: Error): string {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected
    // error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return 'Please authorize this website to access your Polygon account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

export const capWord = (s: string) => {
  if (!s || s.length === 0) {
    return
  }
  return s[0].toLocaleUpperCase() + s.slice(1)
}

export const filter = new Filter()
