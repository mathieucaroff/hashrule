import { GroundAutomaton, AirAutomaton } from './automatonType'

/**
 * GroundCell
 */
export type Atom = number[]

export interface AnchoredGroundCell {
   type: 'ground'
   weight: 'anchored'
   id: number
   left: Atom
   right: Atom
   result: () => Atom
   automaton: GroundAutomaton
}

export interface FloatingGroundCell {
   type: 'ground'
   weight: 'floating'
   id: number
   left: Atom
   right: Atom
   result: () => Atom
   __table: Record<number, FloatingAirCell>
   automaton: GroundAutomaton
}

export interface VoidGroundCell {
   type: 'ground'
   weight: 'void'
   id: number
   left: Atom
   right: Atom
   result: () => Atom
   automaton: GroundAutomaton
}

export type GroundCell =
   | AnchoredGroundCell
   | FloatingGroundCell
   | VoidGroundCell

/**
 * AirCell
 */
// export interface AnchoredAirCell extends CellGet<Cell> {
export interface AnchoredAirCell extends CellGet<AirCell> {
   type: 'air'
   weight: 'anchored'
   id: number
   automaton: AirAutomaton
}

// export interface FloatingAirCell extends CellGet<FloatingCell> {
export interface FloatingAirCell extends CellGet<FloatingAirCell> {
   type: 'air'
   weight: 'floating'
   id: number
   __table: Record<number, FloatingAirCell>
   automaton: AirAutomaton
}

// export interface VoidAirCell extends CellGet<VoidCell> {
export interface VoidAirCell extends CellGet<VoidAirCell> {
   type: 'air'
   weight: 'void'
   id: number
   automaton: AirAutomaton
}

export type AirCell = AnchoredAirCell | FloatingAirCell | VoidAirCell

/**
 * Cell
 */
export type Cell = AirCell | GroundCell
export type AnchoredCell = AnchoredAirCell | AnchoredGroundCell
export type FloatingCell = FloatingAirCell | FloatingGroundCell
export type VoidCell = VoidAirCell | VoidGroundCell

/**
 * CellGet
 */
export interface CellGet<TC, F = () => TC> {
   // compute
   left: TC
   right: TC
   center: F
   result: F
   // fullPropagate
   highleft: F
   highright: F
   midleft: F
   midright: F
   // halfPropagate
   lowtopleft: F
   lowtopright: F
   lowbotleft: F
   lowbotright: F
}
