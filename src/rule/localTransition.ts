/**
 * Given a rule number, create a the corresponding local transition function
 */

import { Rule } from '../type/ruleType'

export let localTransition = (rule: Rule) => {
   let base = rule.stateCount

   let length = rule.stateCount ** rule.neighborhoodSize

   console.assert(rule.number >= 0)
   console.assert(rule.number < base ** length)

   let bin = rule.number.toString(base).padStart(length, '0')
   console.assert(bin.length <= length)

   let resultArray = [...bin].map((x) => +x)
   resultArray.reverse()

   let localFunction = (neighborhood: number[]) => {
      console.assert(neighborhood.length == rule.neighborhoodSize)

      console.assert(neighborhood.every((state) => state >= 0))

      console.assert(neighborhood.every((state) => state < rule.stateCount))

      let neighborhoodState = neighborhood.reduce(
         (store, b) => store * rule.stateCount + b,
         0,
      )

      return resultArray[neighborhoodState]
   }

   return localFunction
}
