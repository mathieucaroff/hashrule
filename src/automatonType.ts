import {
   AirCell,
   Atom,
   Cell,
   FloatingAirCell,
   FloatingCell,
   FloatingGroundCell,
   GroundCell,
   VoidAirCell,
   VoidGroundCell,
} from './cellType'

/**
 * TFuseIn   : Type of  Input Cell for .fuse()
 * TFuseOut  : Type of Output Cell for .fuse()
 * TSummonIn : Type of  Input Cell for .fuse()
 * TSummonOut: Type of Output Cell for .fuse()
 * TLevel    : Type of the property .level
 * TVoid     : Type of .voidCell, the void cell
 *
 * About relative cell names:
 * - Proper Cells = TRC (TRC.size == this.size)
 * - Child Cells = TIC (TRC.size == this.size / 2)
 * - Baby Cells (_.size == this.size / 4)
 *
 * Note:
 * Baby cells do not exist for GroundAutomton types since Child Cells are
 * already atoms.
 */
export interface HashlifeBaseAutomaton<
   TFuseIn,
   TFuseOut,
   TSummonIn,
   TSummonOut,
   TLevel,
   TVoid extends TSummonOut
> {
   /**
    * fuse
    * Accepts two floating child cells and fuse them into a proper cell.
    *
    * This operation is cached using the ids and tables from the fused children
    * cells
    */
   fuse: (aa: TFuseIn, bb: TFuseIn) => TFuseOut
   /**
    * summon
    * Accept:
    *
    * - aa and bb -- two cells
    * - (x, y) -- a position for the resulting cell.
    * - prop -- the information about where borders are and the random function
    *   which defines them
    *
    * The combination of {}
    */
   summon: (
      aa: TSummonIn,
      bb: TSummonIn,
      y: number,
      x: number,
      prop: AnchorProp,
   ) => TSummonOut
   level: TLevel
   atomSize: number
   size: number
   voidCell: TVoid
}

export type BorderIndexMap = Record<number, number>

export interface AnchorProp {
   borderHoriz: BorderIndexMap
   borderVert: BorderIndexMap
   // divinInterventionList: DivinIntervention[]
   // interface DivinIntervention extends Pair {  }
   getBorderCell: (borderIndex: number, pos: number) => number
   mergeMethodName: 'fuse' | 'summon'
   weight: 'floating' | 'anchored'
}

/**
 * AirAutomaton
 *
 * Any automaton above a ground automaton
 */
export interface AirAutomaton
   extends HashlifeBaseAutomaton<
      FloatingAirCell,
      FloatingAirCell,
      Cell,
      AirCell,
      number,
      VoidAirCell
   > {
   // child: HashlifeAutomaton
   child: AirAutomaton
}

/**
 * GroundAutomaton
 *
 * A hashrule automaton wrapping an arbitrary automaton
 */
export interface GroundAutomaton
   extends HashlifeBaseAutomaton<
      Atom,
      FloatingGroundCell,
      Atom,
      GroundCell,
      0,
      VoidGroundCell
   > {}

export type HashlifeAutomaton = AirAutomaton | GroundAutomaton

export interface ArbitraryAutomaton {
   stateCount: number
   neigboorhoodSize: number
   localRule: (arr: number[]) => number
}
