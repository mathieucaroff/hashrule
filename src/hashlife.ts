import { createAirAutomaton } from './airAutomaton'
import { AirAutomaton, AnchorProp } from './automatonType'
import { BoiledContent, Content } from './boilerType'
import { derivationCache } from './derivationCache'
import { AirCell, Cell, GroundCell } from './cellType'
import {
   explore,
   fullCellRegion,
   fullPropagate,
   halfCellRegion,
   halfPropagate,
} from './explore'
import { createGroundAutomaton } from './groundAutomaton'
import { Hashlife, HashlifeProp, RequestProp } from './hashlifeType'
import { createPolicy } from './policy'
import { createArray2d } from './util/array2d'
import { putFunction } from './util/putFunction'
import { Frame, Region } from './util/region'
import { flatCell } from './trash/flatCell'

let w: any = window

export let createHashlife = (prop: HashlifeProp): Hashlife => {
   let { automaton, boiler, draw, random } = prop

   console.log('hashlifeProp', prop)

   let policy = createPolicy({
      boiler,
      atomSize: automaton.neigboorhoodSize - 1,
   })

   /**
    * Root cell summoning
    */
   let anchorInfo: AnchorProp = {
      borderHoriz: [0],
      borderVert: [],
      getBorderCell: (borderIndex: number, pos) => {
         // TODO
         // use topology to determine the random odds
         if (borderIndex === 0) {
            return random.top(pos, 2)
         } else if (borderIndex === 1) {
            return random.left(pos, 2)
         } else if (borderIndex === 2) {
            return random.right(pos, 2)
         } else {
            throw new Error(`bad borderIndex value ${borderIndex}`)
         }
      },
      mergeMethodName: 'summon',
      weight: 'anchored',
   }

   const groundAutomaton = createGroundAutomaton(automaton)

   let summonRoot = (v: Cell) => {
      let cell = root.automaton.summon(v, v, root.y, root.x, anchorInfo)
      console.log('level, y', root.automaton.level, root.y)
      console.log('result', flatCell(cell.result()))
      return cell
   }

   let root: {
      readonly x: number
      y: number
      automaton: AirAutomaton
      cell: AirCell
   } = {
      x: 0,
      y: 1,
      automaton: createAirAutomaton(groundAutomaton as any),
      cell: 0 as any,
   }
   root.cell = summonRoot(groundAutomaton.voidCell)

   /**
    * enlarge
    *
    * Double the height and the width of the root cell by switching to
    * the accelerated version of the current rootAutomaton
    */
   let enlarge = () => {
      let oldRootAutomaton = root.automaton
      let oldY = root.y

      root.automaton = createAirAutomaton(oldRootAutomaton)

      root.y = 2 * oldY + 1

      root.cell = summonRoot(oldRootAutomaton.voidCell)
   }

   /**
    * upFitTo
    *
    * enlarge the automaton until it is big enough to fit the given frame
    *
    * @param frame -- the frame to fit to
    */
   let upFitTo = (frame: Frame) => {
      let fitsHorizontally = () =>
         root.automaton.size / 4 >= -frame.xleft &&
         root.automaton.size / 4 >= frame.xright - 1

      let fitsVertically = () => root.y >= frame.ybottom - 1

      while (!fitsVertically() || !fitsHorizontally()) {
         enlarge()
      }
   }

   let imageCache = derivationCache<ImageData>()

   /**
    * request
    *
    * handle the user's draw request
    *
    * @param prop contains the target region and the output function
    */
   let request = (prop: RequestProp) => {
      let { region, output } = prop

      upFitTo(region)

      if (w.d) debugger

      let relativeRegion = Region.recenter(region, {
         x: region.center.x - root.x,
         y: region.center.y - root.y,
      })

      // console.log(
      //    'request',
      //    root.cell.automaton.level,
      //    root.cell.id,
      //    relativeRegion.rect,
      // )

      explore(root.cell, relativeRegion, {
         propagate: halfPropagate,
         cellRegionGetter: halfCellRegion,
         level: policy.imageLevel,
         callback: imageCache<AirCell>({
            derivate: derivateImage,
            output: (data, relativeRegion) => {
               // relativeRegion is the original relativeRegion,
               // but now relative to the given cell (`cell`)
               let absoluteRegion = Region.recenter(relativeRegion, {
                  x: relativeRegion.center.x + root.x,
                  y: relativeRegion.center.y + root.y,
               })
               output(data, absoluteRegion)
            },
         }),
      })
   }

   let boiledContentCache = derivationCache<BoiledContent>()

   /**
    * derivateImage
    *
    * compute the image of a cell using `hashlifeProp.draw`
    *
    * @param cell the cell whose image is wanted
    */
   let derivateImage = (cell: AirCell): ImageData => {
      console.log('derivateImage', cell.automaton.level, cell.id)

      if (w.d) debugger

      let region = halfCellRegion(cell)
      let { height, width } = region

      let boiledBuffer: BoiledContent = createArray2d(height, width, 0 as any)

      let putInBuffer = putFunction(boiledBuffer)

      let callback = boiledContentCache<AirCell>({
         derivate: derivateBoiledContent,
         output: putInBuffer,
      })

      explore(cell, region, {
         propagate: halfPropagate,
         cellRegionGetter: halfCellRegion,
         level: policy.boilLevel,
         callback,
      })

      return draw(boiledBuffer)
   }

   /**
    * derivateBoiledContent
    *
    * obtain the content of a cell, boil it and return it
    *
    * @param cell the cell whose boiled content is wanted
    */
   let derivateBoiledContent = (cell: AirCell): BoiledContent => {
      console.log('derivateBoiled', cell.automaton.level, cell.id)

      if (w.d) debugger

      let height = 2 ** cell.automaton.level

      let content: Content = createArray2d(height, cell.automaton.size, -1)

      let region = fullCellRegion(cell)

      let putInContent = putFunction(content)

      let callback = (cell: Cell, region: Region) => {
         if (cell.type === 'air') throw new Error()
         putInContent(derivateContent(cell), region)
      }

      explore(cell, region, {
         propagate: fullPropagate,
         cellRegionGetter: fullCellRegion,
         level: 0,
         callback,
      })

      return boiler.boil(content)
   }

   /**
    * derivateContent
    *
    * obtain the content of a ground cell
    */
   let derivateContent = (cell: GroundCell): Content => {
      // console.log('derivateContent', cell.automaton.level, cell.id)

      if (w.d) debugger

      return [cell.result()]
   }

   return {
      request,
   }
}

let howToImplement = `
rule() -> automaton(level)
area -> mainLevel
boiler.{marginLeft, marginRight, marginTop} &[CONST_POLICY] -> policy
groundAutomaton, random, topology -> allInitialCells
`
