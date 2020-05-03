export interface AirBoard {
   type: 'air'
   left: Board
   right: Board
   level: number
}

export interface GroundBoard {
   type: 'ground'
   content: number[]
   level: number
}

/**
 * A board is either a fixed-size list of cells of the external automaton, or
 * the combination of two boards of the inferior level.
 *
 * In practice, every board is a balanced binary tree of boards. The air cells
 * are the nodes and the ground boards are the leafs. The groud cells contain a
 * number of cells from the external automaton: `V - 1` cells per ground cell,
 * where V is the size of the neighboorhood.
 */
export type Board = AirBoard | GroundBoard
