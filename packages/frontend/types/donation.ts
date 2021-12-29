import { BigNumber } from 'ethers'

export interface Donation {
  giver: string
  message: string
  name: string
  cakeSize: string
  timestamp: BigNumber
}