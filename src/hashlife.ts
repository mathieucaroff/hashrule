import { createAirAutomaton } from './airAutomaton'
import { AirAutomaton, AnchorProp } from './automatonType'
import { BoiledContent, Content } from './boilerType'
import { cachedCellDerivationOutputFunction } from './cachedCellDerivationOutput'
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
   }

   const groundAutomaton = createGroundAutomaton(automaton)

   let summonRoot = (v: Cell) =>
      root.automaton.summon(v, v, root.y, root.x, anchorInfo)

   let root: {
      readonly x: number
      y: number
      automaton: AirAutomaton
      cell: AirCell
   } = {
      x: 0,
      y: 0,
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

   /**
    * request
    *
    * handle the user's draw request
    *
    * @param prop contains the target region and the output function
    */
   let request = (prop: RequestProp) => {
      let { region: area, output } = prop
      let frame = Frame.fromArea(area)

      upFitTo(frame)

      let relativeRegion = Region.recenter(area, {
         x: area.center.x - root.x,
         y: area.center.y - root.y,
      })
      explore(root.cell, relativeRegion, {
         propagate: halfPropagate,
         cellRegionGetter: halfCellRegion,
         level: policy.imageLevel,
         callback: cachedCellDerivationOutputFunction<AirCell, ImageData>({
            derivate: derivateImage,
            output,
         }),
      })
   }

   /**
    * derivateImage
    *
    * compute the image of a cell using `hashlifeProp.draw`
    *
    * @param cell the cell whose image is wanted
    */
   let derivateImage = (cell: AirCell): ImageData => {
      let region = halfCellRegion(cell)
      let { height, width } = region

      let boiledBuffer: BoiledContent = createArray2d(height, width, 0 as any)

      let putInBuffer = putFunction(boiledBuffer)

      let ccdo = cachedCellDerivationOutputFunction<AirCell, BoiledContent>({
         derivate: derivateBoiledContent,
         output: putInBuffer,
      })

      explore(cell, region, {
         propagate: halfPropagate,
         cellRegionGetter: halfCellRegion,
         level: policy.boilLevel,
         callback: ccdo,
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
      let height = 2 ** cell.automaton.level

      let content: Content = createArray2d(height, cell.automaton.size, -1)

      let region = fullCellRegion(cell)

      let putInContent = putFunction(content)

      let callback = (cell: Cell, region: Region) => {
         if (cell.type === 'air') throw cell
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
   let derivateContent = (cell: GroundCell): Content => [cell.result()]

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
