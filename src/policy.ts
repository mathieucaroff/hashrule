import { Policy } from './policyType'
import { Boiler } from './boilerType'

let IMAGE_LEVEL_MIN = 8

export interface PolicyProp {
   atomSize: number
   boiler: Boiler
}

export let createPolicy = (prop: PolicyProp): Policy => {
   let { boiler, atomSize } = prop

   let maxLR = Math.max(boiler.marginLeft, boiler.marginRight)

   let boilLevel = 3 // Cannot boil under 3 /!\
   let size = atomSize
   let height = 1

   while (maxLR * 4 > size || boiler.marginTop * 2 > height) {
      boilLevel++
      size *= 2
      height *= 2
   }

   while (maxLR * 4 > size || boiler.marginTop * 2 > height) {
      boilLevel++
      size *= 2
      height *= 2
   }

   return {
      imageLevel: Math.max(IMAGE_LEVEL_MIN, boilLevel),
      boilLevel,
   }
}
