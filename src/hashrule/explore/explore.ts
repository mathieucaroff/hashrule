import { AirCell, Cell } from '../type/oldCellType'
import { Frame, Region } from '../type/rectType'

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

/**
 * Explore a cell untile a certain level is reached.
 *
 * @param cell The cell to explore
 * @param rect The part of the cell that needs exploring
 * @param exploreProp {
 *    @param level The level at which exploration must stop
 *    @param callback The function to call when the level is reached. For each
 *       cell hit at that level, this callback receives that cell along with the
 *       starting region, moved so that its position is relative to the cell
 *    @param cellRegionGetter The functiong to call to obtain the region covered
 *       by a cell when computing intersections
 *    @param propagate The function which knows what are the relevant child
 *       cells of a given cell, and which uses that knowledge to calls the given
 *       callback on each of these meaningful child cell. This is a key part of
 *       the recursive exploration.
 *       It accepts three parameters: A cell, a region and a callback
 *       For each relevant child of the cell, it must compute the relative
 *       region position, and call the callback passing it that child cell and
 *       that relative region.
 *       Note: this file provides {fullPropagate} and {halfPropagate}, these two
 *       functions are meant to be used as {propagate} parameter of explore()
 * }
 */
