import { BigNumberish, ethers } from 'ethers'
import React from 'react'
import { Donation } from '../types/donation'
import { fromUnixTime, formatDistanceToNow } from 'date-fns'
import {
  VStack,
  Text,
  Divider,
  HStack,
  Circle,
  Box,
  Flex,
  Spinner,
} from '@chakra-ui/react'

import { MdOutlineNavigateNext } from 'react-icons/md'

interface Props {
  item?: Donation
}

const displayDate = (ts: BigNumberish) => {
  const unix = +ethers.utils.formatUnits(ts, 0)
  const date = fromUnixTime(unix)
  const display = formatDistanceToNow(date, { addSuffix: true })
  return display
}

const mapping = {
  0: 'Small',
  1: 'Medium',
  2: 'Large',
}

const DonationItem = ({ item }: Props) => {
  return (
    <HStack borderLeftWidth={2} borderColor="gray.400" spacing={0} py={4}>
      {/* Dot */}
      <Circle w={5} h={5} bg="teal.500" transform="translateX(-10px)">
        <MdOutlineNavigateNext
          color="#fff"
          style={{ transform: 'rotate(-90deg)' }}
        />
      </Circle>
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
        bg="teal.50"
        px={4}
        py={4}
        rounded="lg"
        borderColor="teal.500"
        borderWidth={3}
        boxShadow="md"
        transform="translateX(-10px)"
      >
        {!item ? (
          <Flex justifyContent="center" alignItems="center" width="full">
            <Text>Start</Text>
          </Flex>
        ) : item.isLoading ? (
          <>
            <VStack alignSelf="flex-start" spacing={0}>
              <Text fontSize="xs" alignSelf="flex-start" color="gray.500">
                {displayDate(item?.timestamp)}
              </Text>
            </VStack>
            {/* Replace with spinner */}
            <Spinner style={{ marginTop: '1rem', marginBottom: '1rem' }} />

            <Divider />
            <VStack spacing={0}>
              <Text fontSize="xs" alignSelf="flex-end" color="gray.500">
                Address: {item?.giver}
              </Text>
            </VStack>
          </>
        ) : (
          <>
            <VStack alignSelf="flex-start" spacing={0}>
              <Text fontSize="xs" alignSelf="flex-start" color="gray.500">
                {displayDate(item?.timestamp)}
              </Text>
              <Text fontSize="sm" fontWeight="semibold" alignSelf="flex-start">
                {item?.name} sent a {mapping[item?.cakeSize?.toNumber()]}{' '}
                Cheesecake
              </Text>
            </VStack>

            <Text py={4}>{item?.message}</Text>

            <Divider />
            <VStack spacing={0}>
              <Text fontSize="xs" alignSelf="flex-end" color="gray.500">
                Address: {item?.giver}
              </Text>
            </VStack>
          </>
        )}
      </VStack>
    </HStack>
  )
}

export default DonationItem
