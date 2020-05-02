import { BoilerFunction, Boiler, BoiledPoint } from '../type/boilerType'
import { Pattern } from '../type/patternType'
import { invisibleRight, invisibleLeft } from './invisibleSide'

export interface PatternBoilerProp {
   patternList: Pattern[]
}

export let createPatternBoiler = (prop: PatternBoilerProp): Boiler => {
   let { patternList } = prop

   let marginLeftList: number[] = [0]
   let marginRightList: number[] = [0]
   let marginTopList: number[] = [0]

   patternList.forEach(({ pattern: root }) => {
      let { content, width } = root
      let mLeft = width - 1 - invisibleRight(content)
      let mRight = width - 1 - invisibleLeft(content)
      let mTop = (width - (width % 2)) / 2

      marginLeftList.push(mLeft)
      marginRightList.push(mRight)
      marginTopList.push(mTop)
   })

   let boil: BoilerFunction = (input) => {
      return input.slice(input.length / 2).map((line) => {
         let fraction = line.length / 4

         let lineCenter = line.slice(fraction, 3 * fraction)

         return lineCenter.map((state) => ({
            patternNumber: 0,
            state,
         }))
      })
   }

   let marginLeft = Math.max(...marginLeftList)
   let marginRight = Math.max(...marginRightList)
   let marginTop = Math.max(...marginTopList)

   return {
      marginLeft,
      marginRight,
      marginTop,
      boil,
   }
}
