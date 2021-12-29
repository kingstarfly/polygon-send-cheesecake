import { AspectRatio, Flex, Heading, VStack } from '@chakra-ui/react'
import { ethers } from 'ethers'
import React from 'react'
import { CheesecakePortalContract as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import CheesecakePortal from '../artifacts/contracts/CheesecakePortal.sol/CheesecakePortal.json'
import { Layout } from '../components/layout/Layout'
import { CheesecakePortal as CheesecakePortalContractType } from '../types/typechain'
import { ChainId, useEthers } from '@usedapp/core'
import { Donation } from '../types/donation'
import DonationItem from '../components/DonationItem'
import { filter } from '../lib/utils'
import CakeOrderSheet, { PRICES } from 'components/CakeOrderSheet'
import Image from 'components/Image'

/**
 * Constants & Helpers
 */

const MUMBAI_CONTRACT_ADDRESS = '0xBC281AC19947790c1cDF0Dc2cf09B795c246baA0'
const POLYGON_CONTRACT_ADDRESS = 'TBC' // todo

function HomeIndex(): JSX.Element {
  const [isLoading, setIsLoading] = React.useState(false)
  const [donations, setDonations] = React.useState<Donation[]>([])

  const { account, chainId, library } = useEthers()

  let CONTRACT_ADDRESS = React.useMemo(() => {
    console.log({ chainId })
    console.log({ account })
    console.log({ library })
    switch (chainId) {
      case ChainId.Localhost || ChainId.Hardhat:
        return LOCAL_CONTRACT_ADDRESS
      case ChainId.Mumbai:
        return MUMBAI_CONTRACT_ADDRESS
      case ChainId.Polygon:
        return POLYGON_CONTRACT_ADDRESS
      default:
        return LOCAL_CONTRACT_ADDRESS
    }
  }, [ChainId, account])

  const contract = React.useMemo(() => {
    if (!library) {
      return null
    }
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      CheesecakePortal.abi,
      library.getSigner()
    ) as CheesecakePortalContractType
  }, [chainId, library, CONTRACT_ADDRESS])

  const isLocalChain =
    chainId === ChainId.Localhost || chainId === ChainId.Hardhat

  const fetchAllDonations = async () => {
    if (library) {
      try {
        const data = await contract.getAllDonations()

        // Sort data by timestamp
        const sortedData = data
          .slice()
          .map((x) => ({
            ...x,
            name: filter.clean(x.name),
            message: filter.clean(x.message),
          }))
          .sort((a, b) => {
            return b.timestamp.toNumber() - a.timestamp.toNumber()
          })
        setDonations(sortedData)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: ', err)
      }
    }
  }

  async function sendCheesecake(
    cakeSize: 'small' | 'medium' | 'large',
    name: string,
    message: string
  ) {
    if (library) {
      setIsLoading(true)
      let ethersAmount: number
      switch (cakeSize) {
        case 'small':
          ethersAmount = PRICES.small
          break
        case 'medium':
          ethersAmount = PRICES.medium
          break
        case 'large':
          ethersAmount = PRICES.large
          break
        default:
          break
      }

      try {
        console.log(
          `Client side sending over ${ethersAmount} ethers = ${ethers.utils.parseEther(
            ethersAmount.toString()
          )} WEI`
        )
        const transaction = await contract.sendCheesecake(
          message,
          name,
          cakeSize,
          ethers.utils.parseEther(ethersAmount.toString())
          //   ethers.utils.parseEther('10000000')
        )
        await transaction.wait()
        await fetchAllDonations()
      } catch (error) {
        console.error(error)
      }

      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchAllDonations()
  }, [library, fetchAllDonations])

  return (
    <Layout>
      <VStack alignItems="center" mb={8} height="full">
        <AspectRatio ratio={1} width="6rem">
          <Image
            transition="ease-out"
            transitionProperty="all"
            transitionDuration="normal"
            src="/images/Cheesecake.svg"
            alt="Image of a cheesecake"
            layout="fill"
            objectFit="contain"
          />
        </AspectRatio>
        <Heading as="h1" fontSize="3xl">
          Send Xing Xiang a Cheescake!
        </Heading>
      </VStack>
      <Flex
        w="full"
        justifyContent="space-around"
        alignItems="center"
        maxWidth="container.lg"
      >
        {/* Form */}
        <CakeOrderSheet sendCheesecake={sendCheesecake} isLoading={isLoading} />

        <VStack
          spacing={0}
          pl={2}
          maxHeight="50vh"
          overflowY="auto"
          alignItems="flex-start"
        >
          {donations.map((donation, index) => (
            <DonationItem key={index} item={donation} />
          ))}
        </VStack>
      </Flex>
    </Layout>
  )
}

export default HomeIndex
