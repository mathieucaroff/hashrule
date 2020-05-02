import { default as ava } from 'ava'
import { createPatternBoiler } from './patternBoiler'
import { BoiledPoint } from '../type/boilerType'

ava('create patternBoiler', (t) => {
   createPatternBoiler({
      patternList: [],
   })

   t.pass()
})

ava('use boiler function', (t) => {
   let boiler = createPatternBoiler({
      patternList: [],
   })

   // The below three asserts are not functional expectations
   // they just check assumptions about implementation details
   // that the rest of the test rely on
   t.assert(boiler.marginLeft <= 1)
   t.assert(boiler.marginRight <= 1)
   t.assert(boiler.marginTop <= 1)

   let zero: BoiledPoint = {
      state: 0,
      patternNumber: 0,
   }

   let one: BoiledPoint = {
      state: 1,
      patternNumber: 0,
   }

   t.deepEqual(
      boiler.boil([
         [0, 0, 0, 0],
         [0, 0, 0, 0],
      ]),
      [[zero, zero]],
   )

   t.deepEqual(
      boiler.boil([
         [0, 0, 0, 0],
         [0, 1, 0, 0],
      ]),
      [[one, zero]],
   )
})
