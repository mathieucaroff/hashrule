import { RandomMapperFunction, RandomMapperObj } from '../type/randomMapper'
import { RandomInteger } from './randomInteger'

export interface RandomMapperProp {
   randomInteger: RandomInteger
   seedString: string
}

export let createRandomMapper = (prop: RandomMapperProp) => {
   let { randomInteger, seedString } = prop

   let count = 1

   let randomSlice = (k: number): RandomMapperFunction => {
      return (pos: number, size: number) => {
         return randomInteger(seedString, pos * count + k, size)
      }
   }

   let me: RandomMapperObj = {
      top: randomSlice(0),
      left: randomSlice(1),
      right: randomSlice(2),
   }

   return me
}
