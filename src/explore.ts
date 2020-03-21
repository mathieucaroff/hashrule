import { AirCell, Cell } from './cellType'
import { Frame, Region } from './util/region'

export interface ExploreProp {
   level: number
   callback: ExplorerCallback
   cellRegionGetter: (cell: Cell) => Region
   propagate: (
      // cell: Cell,
      cell: AirCell,
      region: Region,
      callback: ExplorerCallback,
   ) => void
}

export type ExplorerCallback = (cell: AirCell, region: Region) => void

export let explore = (cell: Cell, region: Region, exploreProp: ExploreProp) => {
   console.assert(exploreProp.level >= 0)
   console.assert(cell.automaton.level >= exploreProp.level)
   return exploreRecursive(cell, region, exploreProp)
}

let exploreRecursive = (
   cell: Cell,
   region: Region,
   exploreProp: ExploreProp,
) => {
   console.log(
      cell.automaton.level,
      cell.id,
      cell.type,
      cell.weight,
      region.center.x,
      region.ytop,
      region.ybottom,
   )
   if (emptyIntersection(exploreProp.cellRegionGetter(cell), region)) {
      return
   }

   if (cell.automaton.level === exploreProp.level) {
      exploreProp.callback(cell as any, region)
      return
   }

   exploreProp.propagate(cell as AirCell, region, (childCell, childRegion) => {
      exploreRecursive(childCell, childRegion, exploreProp)
   })
}

let emptyIntersection = (a: Frame, b: Frame): boolean => {
   return (
      a.xright <= b.xleft &&
      b.xright <= a.xleft &&
      a.ybottom <= b.ytop &&
      b.ybottom <= b.ytop
   )
}

/**
 * fullPropagate
 *
 * Should be used along with fullCellRegionGetter, in explorer's prop
 */
export let fullPropagate = (
   cell: Cell,
   region: Region,
   callback: ExplorerCallback,
) => {
   if (cell.type === 'ground') {
      throw new Error()
   }
   let height = 2 ** cell.automaton.level
   let { size } = cell.automaton

   let { center } = region

   let recenter = (x: number, y: number) => Region.recenter(region, { x, y })

   let cytop = center.y + height / 2
   if (cell.automaton.level === 1) {
      callback(cell.left, recenter(center.x + size / 2, cytop))
      callback(cell.center(), recenter(center.x + 0, cytop))
      callback(cell.right, recenter(center.x - size / 2, cytop))
   } else {
      callback(cell.highleft(), recenter(center.x + size / 4, cytop))
      callback(cell.highright(), recenter(center.x - size / 4, cytop))
   }

   let cybot = center.y
   callback(cell.midleft(), recenter(center.x + size / 4, cybot))
   callback(cell.midright(), recenter(center.x - size / 4, cybot))
}

/**
 * halfPropagate
 *
 * Should be used with halfCellRegionGetter in explorer's prop
 *
 * @param cell
 * @param region
 * @param callback
 */
export let halfPropagate = (
   cell: AirCell,
   region: Region,
   callback: ExplorerCallback,
) => {
   let height = 2 ** cell.automaton.level
   let { size } = cell.automaton

   let { center } = region

   let recenter = (x: number, y: number) => Region.recenter(region, { x, y })

   let cytop = center.y + height / 4
   callback(cell.lowtopleft(), recenter(center.x + size / 8, cytop))
   callback(cell.lowtopright(), recenter(center.x - size / 8, cytop))

   let cybot = center.y
   callback(cell.lowbotleft(), recenter(center.x + size / 8, cybot))
   callback(cell.lowbotright(), recenter(center.x - size / 8, cybot))
}

export let fullCellRegion = (cell: Cell): Region => {
   let width = cell.automaton.size
   let height = 2 ** cell.automaton.level

   return Region.fromRect({
      width,
      height,
      x: -width / 2,
      y: -height + 1,
   })
}

export let halfCellRegion = (cell: Cell): Region => {
   let width = cell.automaton.size / 2
   let height = 2 ** (cell.automaton.level - 1)

   return Region.fromRect({
      width,
      height,
      x: -width / 2,
      y: -height + 1,
   })
}
