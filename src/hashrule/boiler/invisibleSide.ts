import { PatternElement } from '../type/patternType'

let invisibleSide = (reordered: any) => (patternElemList: PatternElement[]) => {
   let margin = 0
   for (let pattern of reordered(patternElemList)) {
      if (pattern.visibility === 'hidden') {
         margin += pattern.width
      } else {
         if (pattern.type === 'group') {
            margin += invisibleSide(reordered)(pattern.content)
         }
         break
      }
   }
   return margin
}

export let invisibleLeft = invisibleSide((li) => li)
export let invisibleRight = invisibleSide((li) => [...li].reverse())
