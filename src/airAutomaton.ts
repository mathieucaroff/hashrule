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
import { flatCell } from './trash/flatCell'

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
            weight: 'floating',
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
      // console.log('summon', aa.weight, aa.id, bb.weight, bb.id, y, x)
      console.assert(aa.automaton === child, 'aa.automaton === child')
      console.assert(bb.automaton === child, 'bb.automaton === child')

      let xfarleft = x - size
      let xfarright = x + size

      let ytop = y - height
      let yfarinf = y + height
      // yfarinf
      // form this y position onward, there are no state that the cell can
      // predict for sure (at any x position)
      // yfarinf is the "absolute bottom" of the cell

      let half = child.atomSize / 2

      let xInCell = (xx: number) =>
         xfarleft + half <= xx && xx < xfarright - half

      let yInCell = (yy: number) => ytop < yy && yy < yfarinf

      // Anchored by an horizontal border ?
      let isAnchoredHoriz = () => {
         return Object.keys(prop.borderHoriz).some((key) => yInCell(+key))
      }

      // Anchored by a vertical border ?
      let isAnchoredVert = () => {
         if (yfarinf <= +Object.keys(prop.borderHoriz).sort()[0]) {
            return false
         }
         return Object.keys(prop.borderVert).some((key) => xInCell(+key))
      }

      let isVoid = () => aa.weight === 'void' && bb.weight === 'void'

      let isFull = () => aa.weight === 'floating' && bb.weight === 'floating'

      if (isAnchoredHoriz() || isAnchoredVert()) {
         let summonedAA = child.summon(
            aa.left as any,
            aa.right as any,
            y - height / 2,
            x - size / 2,
            prop,
         ) // Give summon a change to transform a void cell into an anchored cell
         let summonedBB = child.summon(
            bb.left as any,
            bb.right as any,
            y - height / 2,
            x + size / 2,
            prop,
         ) // ...
         return createAnchoredCell(summonedAA, summonedBB, y, x, prop)
      } else if (isVoid()) {
         return voidCell
      } else if (isFull()) {
         return fuse(aa as any, bb as any)
      } else {
         debugger
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
   ): AirCell => {
      // console.log(
      //    'createAC',
      //    prop.mergeMethodName,
      //    flatCell(aa),
      //    flatCell(bb),
      //    y,
      //    x,
      // )
      console.assert(aa.automaton.level === bb.automaton.level)

      let ww = aa.weight + bb.weight
      if (ww.includes('void') && ww !== 'voidvoid') {
         console.error('createAnchoredCell', aa.automaton.level, aa, bb, y, x)
         // Note: this criterion only holds for borderless topologies
      }

      let ymidup = y - (3 * height) / 4
      let ymid = y - height / 2
      let ymiddown = y - height / 4
      let ybot = y
      let yinf = y + height / 2

      let xleft = x - size / 2
      let xmidleft = x - size / 4
      let xmid = x
      let xmidright = x + size / 4
      let xright = x + size / 2

      type TSummon = typeof child['summon']
      let cs: TSummon = child?.[prop.mergeMethodName] as any // child.summon or child.fuse
      let ccs: TSummon = child?.child?.[prop.mergeMethodName] as any // ...
      let cccs: TSummon = child?.child?.child?.[prop.mergeMethodName] as any // ...

      let center = memoized(() => {
         return cs(aa.right, bb.left, ymid, xmid, prop)
      })

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
      let midleft = memoized(() => {
         // console.log(
         //    'midleft',
         //    aa.weight ?? '',
         //    center().weight ?? '',
         //    flatCell(aa.result()),
         //    flatCell(center().result()),
         //    ybot,
         //    xmidleft,
         // )
         // debugger
         return cs(aa.result(), center().result(), ybot, xmidleft, prop)
      })
      let midright = memoized(() =>
         cs(center().result(), bb.result(), ybot, xmidright, prop),
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

      let mmy = y - (3 * height) / 8

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

      let meCell: AnchoredAirCell = {
         type: 'air',
         weight: prop.weight as any,
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

      if (prop.weight === 'floating') {
         ;(meCell as any).__table = []
      }

      // console.log('meCell', meCell)

      return meCell
   }

   let fVoid = () => child.voidCell
   let voidCell: VoidAirCell = {
      type: 'air',
      weight: 'void',
      id: newId(),
      left: child.voidCell,
      right: child.voidCell,
      center: fVoid,
      result: () => {
         throw new Error()
      },
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
      fuse,
      level,
      child,
      atomSize: child.atomSize,
      size,
      voidCell,
   }

   voidCell.automaton = me

   return me
}
