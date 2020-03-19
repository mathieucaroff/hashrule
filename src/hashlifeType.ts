import { ArbitraryAutomaton } from './automatonType'
import { Boiler, BoiledContent } from './boilerType'
import { RandomMapper } from './randomMapper'
import { Region } from './util/region'

export interface Hashlife {
   request: (prop: RequestProp) => void
}

export interface HashlifeProp {
   /**
    * Automaton to accelerate
    */
   automaton: ArbitraryAutomaton
   /**
    * Produces boiled content from content.
    * Can be used to do pattern recognition.
    */
   boiler: Boiler
   /**
    * Writes boiled content to an imageData object.
    */
   draw: DrawFunction
   /**
    * Provides three deterministic seeded random function for top, left and
    * right borders
    */
   random: RandomMapper
   // /**
   //  * Finitness and size of the universe
   //  */
   // topology: Topology
   // We'll suppose that it is infinite
}

export interface RequestProp {
   /**
    * The region that must be covered by the data sent to the output function
    */
   region: Region
   /**
    * Accepts an imageData and the location of its center,
    * and puts it at the right place in the canvas.
    * (`putImageData`)
    */
   output: OutputFunction
}

export type DrawFunction = (input: BoiledContent) => ImageData

export type OutputFunction = (image: ImageData, region: Region) => void

// About changes
//
// rule() -> invalidate everything
// random, topology -> invalidate the main cell
//   (note: it's possible to do better)
//   (but it's probably not necessary)
// boiler.boil -> invalidate the boiledContent and image
// draw -> invalidate image
// output -> nothing invalidated
// policy.imageLevel -> invalidate nothing
