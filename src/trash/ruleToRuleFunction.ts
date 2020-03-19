export type NeighborhoodFunction = (relativePos: number) => number

export type RuleFunction = (f: NeighborhoodFunction) => number

export let ruleToRuleFunction = (ruleNumber: number): RuleFunction => {
   let bin = ruleNumber.toString(2)
   let [n7, n6, n5, n4, n3, n2, n1, n0] = [...bin].map(parseInt)

   let localRule = (f: NeighborhoodFunction) => {
      let a = f(-1)
      let b = f(0)
      let c = f(+1)

      return (
         (~a & ((~b & ((~c & n0) | (c & n1))) | (b & ((~c & n2) | (c & n3))))) |
         (+a & ((~b & ((~c & n4) | (c & n5))) | (b & ((~c & n6) | (c & n7)))))
      )
   }

   return localRule
}
