import { BigNumberish, ethers } from 'ethers'
import React from 'react'
import { Donation } from '../types/donation'
import { fromUnixTime, formatDistanceToNow } from 'date-fns'
import { VStack, Text, Divider, HStack, Circle, Box } from '@chakra-ui/react'
import { capWord } from 'lib/utils'

interface Props {
  item: Donation
}

const displayDate = (ts: BigNumberish) => {
  const unix = +ethers.utils.formatUnits(ts, 0)
  const date = fromUnixTime(unix)
  const display = formatDistanceToNow(date, { addSuffix: true })
  return display
}

const DonationItem = ({ item }: Props) => {
  return (
    <HStack borderLeftWidth={2} borderColor="gray.400" spacing={0} py={4}>
      {/* Dot */}
      <Circle w={5} h={5} bg="teal.500" transform="translateX(-10px)" />
      {/* Connecting Line */}
      <Box
        h={0.5}
        w={10}
        bg="teal.300"
        rounded="full"
        m={0}
        p={0}
        transform="translateX(-10px)"
      />
      <VStack
        // spacing={4}
        bg="teal.50"
        // ml={4}
        px={4}
        py={4}
        rounded="lg"
        borderColor="teal.500"
        borderWidth={3}
        boxShadow="md"
        transform="translateX(-10px)"
      >
        <VStack alignSelf="flex-start" spacing={0}>
          <Text fontSize="xs" alignSelf="flex-start" color="gray.500">
            {displayDate(item.timestamp)}
          </Text>
          <Text fontSize="sm" fontWeight="semibold" alignSelf="flex-start">
            {item.name} sent a {capWord(item.cakeSize)} Cheesecake
          </Text>
        </VStack>

        <Text py={4}>{item.message}</Text>

        <Divider />
        <VStack spacing={0}>
          <Text fontSize="xs" alignSelf="flex-end" color="gray.500">
            Address: {item.giver}
          </Text>
        </VStack>
      </VStack>
    </HStack>
  )
}

export default DonationItem
