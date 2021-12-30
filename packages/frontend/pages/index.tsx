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
import { CakeSize } from 'components/CakeSizeChoice'

/**
 * Constants & Helpers
 */

const MUMBAI_CONTRACT_ADDRESS = '0x9BcD660f618cD943ba82FEFF939d90F14Af39f16'
const POLYGON_CONTRACT_ADDRESS = 'TBC' // todo

function HomeIndex(): JSX.Element {
  const [isLoading, setIsLoading] = React.useState(false)
  const [donations, setDonations] = React.useState<Donation[]>([])

  const { account, chainId, library } = useEthers()

  const CONTRACT_ADDRESS = React.useMemo(() => {
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

  const fetchAllDonations = React.useCallback(async () => {
    if (library) {
      try {
        const data = await contract.getAllCheesecakes()

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
        console.log(err)
      }
    }
  }, [contract, setDonations])

  async function sendCheesecake(
    cakeSize: CakeSize,
    name: string,
    message: string
  ) {
    if (library) {
      setIsLoading(true)
      let ethersAmount: number
      let cakeCountIndex: number
      switch (cakeSize) {
        case 'small':
          ethersAmount = PRICES.small
          cakeCountIndex = 0
          break
        case 'medium':
          ethersAmount = PRICES.medium
          cakeCountIndex = 1
          break
        case 'large':
          ethersAmount = PRICES.large
          cakeCountIndex = 2
          break
        default:
          break
      }

      try {
        const transaction = await contract.sendCheesecake(
          message,
          name,
          cakeCountIndex,
          {
            value: ethers.utils.parseEther(ethersAmount.toString()),
          }
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
