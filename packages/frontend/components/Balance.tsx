import React from 'react'
import { Text } from '@chakra-ui/react'
import { utils, ethers } from 'ethers'

/**
 * Component
 */
export function Balance(): JSX.Element {
  const [balance, setBalance] = React.useState<string>('0')

  const fetchBalance = React.useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()
    const etherBalance = await signer.getBalance()
    const finalBalance = etherBalance ? utils.formatEther(etherBalance) : ''

    setBalance(finalBalance)
  }, [])
  React.useEffect(() => {
    fetchBalance()
  })

  return <Text>{balance} MATIC</Text>
}
