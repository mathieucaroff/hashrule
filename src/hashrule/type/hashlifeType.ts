import { ExternalAutomaton } from './automatonType'
import { Boiler, BoiledContent } from './boilerType'
import { RandomMapperObj } from '../randomMapper'
import { Region } from '../util/region'

export interface Hashlife {
   request: (prop: RequestProp) => void
}

export interface HashlifeProp {
   /**
    * Automaton to accelerate
    */
   automaton: ExternalAutomaton
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
   random: RandomMapperObj
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
    * An OutputFunction is a function that accepts an imageData and a region
    * describing where that image should be put.
    *
    * This interface was designed to be used with putImageData, putting the
    * imageData in a canvas.
    *
    * The size of the region will always match that of the passed imageData.
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
