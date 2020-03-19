import { AirAutomaton, AnchorProp } from './automatonType'
import {
   AirCell,
   AnchoredAirCell,
   Cell,
   FloatingAirCell,
   VoidAirCell,
   FloatingCell,
} from './cellType'
import { memoized } from './util/memoized'

export let createAirAutomaton = (child: AirAutomaton): AirAutomaton => {
   let id = 0

   let newId = () => {
      return id++
   }

   const level = child.level + 1
   const size = 2 * child.size
   const height = 2 ** level

   let fuse = (aa: FloatingAirCell, bb: FloatingAirCell): FloatingAirCell => {
      let fusion: FloatingAirCell = aa.__table[bb.id]
      if (fusion === undefined) {
         fusion = createAnchoredCell(aa, bb, 0, 0, {
            borderHoriz: [],
            borderVert: [],
            getBorderCell: () => 0,
            mergeMethodName: 'fuse',
         }) as any
         aa.__table[bb.id] = fusion
      }
      return fusion
   }

   /**
    * Summon does routing between:
    * - the void cell
    * - anchored magic cells
    * - floating cells
    * @param prop
    */
   let summon = (
      aa: Cell,
      bb: Cell,
      y: number,
      x: number,
      prop: AnchorProp,
   ): AirCell => {
      let xleft = x - size
      let xright = x + size

      let ytop = y - height
      let ybot = y

      let half = child.atomSize / 2

      let xInCell = (xx: number) => xleft + half <= xx && xx < xright - half

      let yInCell = (yy: number) => ytop < yy && yy <= ybot

      let isAnchoredHoriz = () => {
         return Object.keys(prop.borderHoriz).some((key) => yInCell(+key))
      }

      let isAnchoredVert = () => {
         if (ybot < +Object.keys(prop.borderHoriz).sort()[0]) {
            return false
         }
         return Object.keys(prop.borderVert).some((key) => xInCell(+key))
      }

      let isVoid = () => aa.weight === 'void' && bb.weight === 'void'

      let isFull = () => aa.weight === 'floating' && bb.weight === 'floating'

      if (isAnchoredHoriz() || isAnchoredVert()) {
         return createAnchoredCell(aa as any, bb as any, y, x, prop)
      } else if (isVoid()) {
         return voidCell
      } else if (isFull()) {
         return fuse(aa as any, bb as any)
      } else {
         throw new Error()
         // Unholly mix of void and non-void cells without a border
      }
   }

   // let createCell = (aa: any, bb: any): FloatingAirCell => {
   //    console.assert(aa.level == bb.level)

   //    let center = memoized(() => child.fuse(aa.right, bb.left))

   //    let result = memoized(() => {
   //       let ab: any = center()

   //       let p = aa.result()
   //       let q = ab.result()
   //       let r = bb.result()

   //       let u: any = child.fuse(p, q).result()
   //       let v: any = child.fuse(q, r).result()

   //       return child.fuse(u, v)
   //    })

   //    return {
   //       type: 'air',
   //       weight: 'floating',
   //       id: newId(),
   //       left: aa,
   //       right: bb,
   //       center,
   //       result,
   //       automaton: me,
   //       __table: [],
   //    }
   // }

   let createAnchoredCell = (
      aa: AirCell,
      bb: AirCell,
      y: number,
      x: number,
      prop: AnchorProp,
   ): AnchoredAirCell => {
      let ymidup = y + (3 * height) / 4 // /!\ sign might be off
      let ymid = y + height / 2
      let ymiddown = y + height / 4
      let ybot = y
      let yinf = y - height / 2 // /!\ sign might be off

      let xleft = x - size / 2
      let xmidleft = x - size / 4
      let xmid = x
      let xmidright = x + size / 4
      let xright = x + size / 2

      let cs = child?.summon
      let ccs = child?.child?.summon
      let cccs = child?.child?.child?.summon

      let center = memoized(() => cs(aa.right, bb.left, ymid, xmid, prop))

      let result = memoized(() =>
         cs(midleft().result(), midright().result(), yinf, xmid, prop),
      )

      /**
       * fullpropagation
       * util functions
       */
      let smallLeft = memoized(() =>
         ccs(aa.left.right, aa.right.left, ymidup, xleft, prop),
      )
      let smallCenter = memoized(() =>
         ccs(aa.right.right, bb.left.left, ymidup, xmid, prop),
      )
      let smallRight = memoized(() =>
         ccs(bb.right.left, bb.left.right, ymidup, xright, prop),
      )

      /**
       * fullpropagation
       * public functions
       */
      let highleft = memoized(() =>
         cs(smallLeft(), smallCenter(), ymid, xmidleft, prop),
      )
      let highright = memoized(() =>
         cs(smallCenter(), smallRight(), ymid, xmidright, prop),
      )
      let midleft = memoized(() =>
         cs(aa.result(), center().result(), ybot, xleft, prop),
      )
      let midright = memoized(() =>
         cs(center().result(), bb.result(), ybot, xright, prop),
      )

      /**
       * halfpropagation
       * util functions
       */
      // for low top
      let ub = () => smallLeft().result()
      let uc = aa.right.result
      let ud = () => smallCenter().result()
      let ue = bb.left.result
      let uf = () => smallRight().result()

      let ubc = () => ccs(ub(), uc(), ymid, x - (3 * size) / 8, prop)
      let ucd = () => ccs(uc(), ud(), ymid, x - (1 * size) / 8, prop)
      let ude = () => ccs(ud(), ue(), ymid, x + (1 * size) / 8, prop)
      let uef = () => ccs(ue(), uf(), ymid, x + (3 * size) / 8, prop)

      // for low bot
      let rl = aa.result
      let rc = () => center().result()
      let rr = bb.result

      let mmy = y + (3 * height) / 8 // /!\ sign might be off

      let mcc = memoized(() =>
         cccs(rl().left.right, rl().right.left, mmy, xleft, prop),
      )
      let mcd = memoized(() =>
         cccs(rl().right.right, rc().left.left, mmy, xmidleft, prop),
      )
      let mdd = memoized(() =>
         cccs(rc().left.right, rc().right.left, mmy, xmid, prop),
      )
      let mde = memoized(() =>
         cccs(rc().right.right, rr().left.left, mmy, xmidright, prop),
      )
      let mee = memoized(() =>
         cccs(rr().left.right, rr().right.left, mmy, xright, prop),
      )

      /**
       * halfpropagation
       * public functions
       */
      let lowtopleft = memoized(() => {
         return cs(ubc(), ude(), ymiddown, x - size / 8, prop)
      })
      let lowtopright = memoized(() => {
         return cs(ucd(), uef(), ymiddown, x + size / 8, prop)
      })
      let lowbotleft = memoized(() => {
         console.assert(level >= 3)
         let ha = ccs(mcc(), mcd(), ymiddown, x - (3 * size) / 8, prop)
         let hb = ccs(mdd(), mde(), ymiddown, x + (1 * size) / 8, prop)
         return cs(ha, hb, ybot, x - size / 8, prop)
      })
      let lowbotright = memoized(() => {
         console.assert(level >= 3)
         let ha = ccs(mcd(), mdd(), ymiddown, x - (1 * size) / 8, prop)
         let hb = ccs(mde(), mee(), ymiddown, x + (3 * size) / 8, prop)
         return cs(ha, hb, ybot, x + size / 8, prop)
      })

      return {
         type: 'air',
         weight: 'anchored',
         id: newId(),
         left: aa,
         right: bb,
         center,
         result,
         highleft,
         highright,
         midleft,
         midright,
         lowbotleft,
         lowbotright,
         lowtopleft,
         lowtopright,
         automaton: me,
      }
   }

   let fVoid = () => child.voidCell
   let voidCell: VoidAirCell = {
      type: 'air',
      weight: 'void',
      id: newId(),
      left: child.voidCell,
      right: child.voidCell,
      center: fVoid,
      result: fVoid,
      highleft: fVoid,
      highright: fVoid,
      midleft: fVoid,
      midright: fVoid,
      lowbotleft: fVoid,
      lowbotright: fVoid,
      lowtopleft: fVoid,
      lowtopright: fVoid,
      automaton: undefined as any,
   }

   let me: AirAutomaton = {
      summon,
      level,
      child,
      atomSize: child.atomSize,
      size,
      voidCell,
   }

   voidCell.automaton = me

   return me
}
