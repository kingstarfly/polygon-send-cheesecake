import React from 'react'
import { SubmitHandler, useController, useForm } from 'react-hook-form'

import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  FormHelperText,
  HStack,
  Textarea,
  VStack,
  useRadioGroup,
  Flex,
  Text,
} from '@chakra-ui/react'
import CakeSizeChoice, { CakeSize, CAKE_SIZES } from './CakeSizeChoice'

interface Inputs {
  name: string
  message: string
  cakeSize: CakeSize
}

interface Props {
  isLoading: boolean
  sendCheesecake: (
    size: CakeSize,
    name: string,
    message: string
  ) => Promise<void>
}

export const PRICES = {
  small: 0.2,
  medium: 0.5,
  large: 1,
}

const CakeOrderSheet = ({ sendCheesecake, isLoading }: Props) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      message: '',
      name: '',
      cakeSize: 'small',
    },
  })

  const {
    field: radioField,
    formState: { errors: radioGroupErrors },
  } = useController({
    control,
    name: 'cakeSize',
    defaultValue: 'small',
    rules: {
      required: { value: true, message: 'Required' },
    },
  })

  const [price, setPrice] = React.useState<number>(PRICES.small)

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'cakeSize',
    defaultValue: 'small',
    value: radioField.value,
    onChange: (value) => {
      radioField.onChange(value)
      setPrice(PRICES[value])
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await sendCheesecake(data.cakeSize, data.name, data.message)
    reset({
      message: '',
      name: '',
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack
        spacing={8}
        p={8}
        borderColor="teal.500"
        borderWidth={3}
        rounded="lg"
        boxShadow="lg"
        bg="gray.50"
      >
        <FormControl isInvalid={Boolean(errors.name)}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            type="text"
            maxLength={20}
            borderWidth={2}
            placeholder="Your name"
            {...register('name', {
              required: 'This is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
              maxLength: { value: 16, message: 'Maximum length should be 16' },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>

          <FormHelperText>Let me know who you are!</FormHelperText>
        </FormControl>
        <FormControl isInvalid={Boolean(errors.message)}>
          <FormLabel htmlFor="message`">Message</FormLabel>
          <Textarea
            id="message"
            type="text"
            size="sm"
            borderWidth={2}
            placeholder="Here's a cheesecake <3"
            {...register('message', {
              required: 'This is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
              maxLength: { value: 120, message: 'Maximum length is 120' },
            })}
          />
          <FormErrorMessage>
            {errors.message && errors.message.message}
          </FormErrorMessage>
          <FormHelperText>Leave a short message! (Max 120 char)</FormHelperText>
        </FormControl>

        <FormControl isInvalid={Boolean(radioGroupErrors['cakeSize'])}>
          <FormLabel>Cheesecake Size</FormLabel>

          <HStack spacing={4} {...getRootProps()}>
            {CAKE_SIZES.map((size) => {
              const radio = getRadioProps({ value: size })
              return <CakeSizeChoice key={size} choice={size} {...radio} />
            })}
          </HStack>
          <FormHelperText>
            Select the type of cheesecake you wish to send me!
          </FormHelperText>
        </FormControl>

        {/* Insert order sheet here */}
        <Flex flexDir="column" justifyContent="center" alignItems="center">
          <Text as="b" fontSize="xl">
            Price: {price} MATIC
          </Text>
        </Flex>

        <Button mt={4} colorScheme="teal" isLoading={isLoading} type="submit">
          Send Cheesecake
        </Button>
      </VStack>
    </form>
  )
}

export default CakeOrderSheet
