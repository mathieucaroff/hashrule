import { default as ava } from 'ava'

import { drawFunction, whitish } from '../draw/drawFunction'
import { createPatternBoiler } from '../hashrule/boiler/patternBoiler'
import { randomInteger } from '../util/randomInteger'
import { createRandomMapper } from '../random/randomMapper'
import { StochasticState } from '../hashrule/type/borderType'
import { ruleToAutomaton } from '../rule/ruleToAutomaton'
import { createHashrule } from './hashrule'

let zero: StochasticState = {
   total: 2,
   cumulativeMap: [1, 0],
}

let one: StochasticState = {
   total: 2,
   cumulativeMap: [0, 1],
}

let neighborhoodSize = 3

ava('Hashrule can be instantiated', (t) => {
   createHashrule({
      automaton: ruleToAutomaton({
         neighborhoodSize,
         number: 0,
         stateCount: 2,
      }),
      boiler: createPatternBoiler({ patternList: [] }),
      draw: drawFunction,
      random: createRandomMapper({
         randomInteger,
         seedString: '_',
      }),
      topology: {
         finitness: 'infinite',
         kind: 'both',
         genesis: {
            kind: 'top',
            center: [],
            cycleLeft: [zero],
            cycleRight: [one],
         },
      },
   })

   t.pass()
})

ava('Initialisation works in the checkerboard case', (t) => {
   let hashrule = createHashrule({
      automaton: ruleToAutomaton({
         neighborhoodSize,
         number: 0,
         stateCount: 2,
      }),
      boiler: createPatternBoiler({ patternList: [] }),
      draw: drawFunction,
      random: createRandomMapper({
         randomInteger,
         seedString: '_',
      }),
      topology: {
         finitness: 'infinite',
         kind: 'both',
         genesis: {
            kind: 'top',
            center: [],
            cycleLeft: [one, zero],
            cycleRight: [zero, one],
         },
      },
   })

   let display: number[][][] = [[[], []]]
   let callcount = 0

   hashrule.request({
      rect: { height: 1, width: 2, x: -1, y: 0 },
      output: (image, region) => {
         callcount++

         t.is(region.y, 0)
         t.is(region.height, 1)
         if (region.x == 0 && region.width == 2) {
            t.fail()
         }
         t.assert(region.x >= -1)
         t.assert(region.x < 1)
         t.assert(region.width < 2)

         Array.from({ length: region.width }, (_, k) => {
            display[region.y][region.x + k] = [
               ...image.data.slice(4 * k, 4 * (k + 1)),
            ]
         })
      },
   })

   t.deepEqual(display, [[whitish, [0, 0, 0]]])

   t.assert(callcount > 0)
})

ava('Rule 105 works in the checkerboard case', (t) => {
   let hashrule = createHashrule({
      automaton: ruleToAutomaton({
         neighborhoodSize,
         number: 105,
         stateCount: 2,
      }),
      boiler: createPatternBoiler({ patternList: [] }),
      draw: drawFunction,
      random: createRandomMapper({
         randomInteger,
         seedString: '_',
      }),
      topology: {
         finitness: 'infinite',
         kind: 'both',
         genesis: {
            kind: 'top',
            center: [],
            cycleLeft: [one, zero],
            cycleRight: [zero, one],
         },
      },
   })

   let display: number[][][] = [[[], [], [], []]]
   let callcount = 0

   hashrule.request({
      rect: { height: 1, width: 4, x: -2, y: 1 },
      output: (image, region) => {
         callcount++

         t.is(region.y, 1)
         t.is(region.height, 1)
         if (region.x + region.width >= 2) {
            t.fail()
         }
         t.assert(region.x >= -2)
         t.assert(region.x < 2)
         t.assert(region.width < 4)

         Array.from({ length: region.width }, (_, k) => {
            display[region.y][region.x + k] = [
               ...image.data.slice(4 * k, 4 * (k + 1)),
            ]
         })
      },
   })

   t.deepEqual(display, [[[0, 0, 0], whitish, [0, 0, 0], whitish]])

   t.assert(callcount > 0)
})
