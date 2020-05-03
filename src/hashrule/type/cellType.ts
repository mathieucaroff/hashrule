import { Board } from './boardType'
import { CellLocation } from './locationType'

/**
 * A cell is a board with added information allowing to:
 * - compute the result of the cell
 * - obtain the pre-display area of the cell
 * - obtain the display area of the cell
 */
export interface Cell {
   board: Board
   cellContext: CellContext
}

/**
 * Cell contexts are hashable.
 */
export interface CellContext {
   location: CellLocation
   cellGlobal: CellGlobal
}

/**
 * Some data passed between cells
 */
export interface CellGlobal {
   getId: GetIdFunction
}

/**
 * Function returning a unique id for the given level
 */
export type GetIdFunction = (level: number) => number
