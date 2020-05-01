export interface RandomMapperObj {
   top: RandomMapperFunction
   left: RandomMapperFunction
   right: RandomMapperFunction
}

export type RandomMapperFunction = (pos: number, rangeSize: number) => number
