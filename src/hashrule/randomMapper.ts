import { Randrange as RandomInteger } from './util/randomInteger'

export type RandomMapperFunction = (pos: number, rangeSize: number) => number

export interface RandomMapperObj {
   top: RandomMapperFunction
   left: RandomMapperFunction
   right: RandomMapperFunction
}

export interface RandomMapperProp {
   randomInteger: RandomInteger
   seedString: string
}

export let createRandomMapper = (prop: RandomMapperProp) => {
   let { randomInteger, seedString } = prop

   let count = 1

   let perfectRandomFunction = (k: number): RandomMapperFunction => {
      return (pos: number, size: number) => {
         return randomInteger(seedString, pos * count + k, size)
      }
   }

   let me: RandomMapperObj = {
      top: perfectRandomFunction(0),
      left: perfectRandomFunction(1),
      right: perfectRandomFunction(2),
   }

   return me
}
