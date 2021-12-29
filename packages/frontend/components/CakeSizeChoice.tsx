import { Box, useRadio, UseRadioProps } from '@chakra-ui/react'
import { capWord } from 'lib/utils'
import React from 'react'

export const CAKE_SIZES = ['small', 'medium', 'large'] as const
export type CakeSize = typeof CAKE_SIZES[number]

interface Props {
  choice: CakeSize
}

const CakeSizeChoice = (props: Props & UseRadioProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {capWord(props.choice)}
      </Box>
    </Box>
  )
}

export default CakeSizeChoice
