import { Rule } from '../type/ruleType'
import { ExternalAutomaton } from '../hashrule/type/automatonType'
import { localTransition } from './localTransition'

export let ruleToAutomaton = (rule: Rule): ExternalAutomaton => {
   // console.assert(rule.stateCount === 2)
   // console.assert(rule.neighborhoodSize === 3)

   // let bin = rule.number.toString(2).padStart(8, '0')
   // let [n7, n6, n5, n4, n3, n2, n1, n0] = [...bin].map((x) => +x)

   // let localRule = ([a, b, c]: number[]) =>
   //    (~a & ((~b & ((~c & n0) | (c & n1))) | (b & ((~c & n2) | (c & n3))))) |
   //    (+a & ((~b & ((~c & n4) | (c & n5))) | (b & ((~c & n6) | (c & n7)))))

   let localRule = localTransition(rule)

   return {
      neigboorhoodSize: 3,
      stateCount: 2,
      localRule,
      hash: `2:3:${rule}`,
   }
}
