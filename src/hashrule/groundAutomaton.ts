import {
   ExternalAutomaton,
   GroundAutomaton,
   AnchorProp,
} from './type/automatonType'

import {
   AnchoredGroundCell,
   Atom,
   GroundCell,
   VoidGroundCell,
   FloatingGroundCell,
} from './cellType'

import { memoized } from './util/memoized'

export let createGroundAutomaton = (
   base: ExternalAutomaton,
): GroundAutomaton => {
   let table: Record<string, FloatingGroundCell> = {}
   ;(window as any).groundTable = table
   let id = 0

   const atomSize = base.neigboorhoodSize - 1
   const size = atomSize

   let newId = () => {
      id++
      return id - 1
   }

   let hash = (aa: Atom, bb: Atom) => '' + aa + ':' + bb

   let fuse = (aa: Atom, bb: Atom): FloatingGroundCell => {
      let abHash = hash(aa, bb)
      let fusion: FloatingGroundCell = table[abHash]

      if (fusion === undefined) {
         fusion = createCell(aa, bb)
         table[abHash] = fusion
      }

      return fusion
   }

   let summon = (
      aa: Atom,
      bb: Atom,
      y: number,
      x: number,
      prop: AnchorProp,
   ): GroundCell => {
      let ww = '' + aa + bb
      if (ww.includes('-1') && ww !== '-1,-1-1,-1') {
         console.error('ground.createAnchoredCell', aa, bb, y, x)
         // Note: this criterion only holds for borderless topologies
      }

      let isVoid = () => [aa, bb].every((zz) => zz.every((v) => v === -1))
      let isFull = () => [aa, bb].every((zz) => zz.every((v) => v !== -1))

      let xleft = x - atomSize / 2
      let xright = x + atomSize / 2

      let xInCell = (xx: number) => xleft <= xx && xx < xright

      let isAnchoredHoriz = () => {
         return y in prop.borderHoriz
      }

      let isAnchoredVert = () => {
         if (y < +Object.keys(prop.borderHoriz).sort()[0]) {
            return false
         }
         return Object.keys(prop.borderVert).some((key) => xInCell(+key))
      }

      if (isAnchoredHoriz() || isAnchoredVert()) {
         // console.log('ground-anchored', y)
         return createAnchoredCell(aa, bb, y, x, prop)
      } else if (isVoid()) {
         // console.log('ground-void', y, x)
         return voidCell
      } else if (isFull()) {
         // console.log('ground-fuse')
         return fuse(aa, bb)
      } else {
         // console.log('ground-error', y, x, aa, bb)
         throw new Error()
         // Unholly mix of void and non-void atoms without a border
      }
   }

   let createCell = (aa: Atom, bb: Atom): FloatingGroundCell => {
      console.assert(
         aa.length === bb.length,
         'mismatch between the two input atom sizes',
      )
      let result = memoized(() => {
         let input = [...aa, ...bb]

         let length = input.length - atomSize
         console.assert(
            length > 0,
            'mismatch between the input atom size and the base neigboorhood size',
         )

         let atomResult: Atom = voidAtom.map((_, k) => {
            return base.localRule(input.slice(k, k + base.neigboorhoodSize))
         })

         return atomResult
      })

      return {
         type: 'ground',
         weight: 'floating',
         id: newId(),
         left: aa,
         right: bb,
         result,
         __table: [],
         automaton: me,
      }
   }

   let voidAtom: Atom = Array(atomSize).fill(-1)

   let voidCell: VoidGroundCell = {
      type: 'ground',
      weight: 'void',
      id: newId(),
      left: voidAtom,
      right: voidAtom,
      result: () => {
         throw new Error('VoidGroundCellResult')
      },
      automaton: undefined as any,
   }

   let createAnchoredCell = (
      aa: Atom,
      bb: Atom,
      y: number,
      x: number,
      prop: AnchorProp,
   ): AnchoredGroundCell => {
      let result = memoized(() => {
         let input = [...aa, ...bb]

         let length = input.length - atomSize
         console.assert(
            length > 0,
            'mismatch between the input atom size and the base neigboorhood size',
         )

         // x0 is the x position of the leftmost cell in the atom
         let x0 = x - atomSize / 2

         let atomResult: Atom
         if (y in prop.borderHoriz) {
            let borderIndex = prop.borderHoriz[y]
            atomResult = voidAtom.map((_, k) => {
               return prop.getBorderCell(borderIndex, x0 + k)
            })
         } else {
            atomResult = voidAtom.map((_, k) => {
               let xx = x0 + k
               if (xx in prop.borderVert) {
                  let borderIndex = prop.borderVert[xx]
                  return prop.getBorderCell(borderIndex, xx)
               }
               let iSlice = input.slice(k, k + base.neigboorhoodSize)
               let sliceHasVoid = iSlice.some((v) => v === -1)
               return sliceHasVoid ? -1 : base.localRule(iSlice)
            })
         }

         return atomResult
      })

      return {
         type: 'ground',
         weight: 'anchored',
         id: newId(),
         left: aa,
         right: bb,
         result,
         automaton: me,
      }
   }

   let me: GroundAutomaton = {
      summon,
      fuse,
      level: 0,
      atomSize,
      size,
      voidCell,
   }

   voidCell.automaton = me

   return me
}
