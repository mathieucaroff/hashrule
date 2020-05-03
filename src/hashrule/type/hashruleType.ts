import { ExternalAutomaton } from './automatonType'
import { BoiledContent, Boiler } from './boilerType'
import { TopologyContext } from './locationType'
import { Rect } from './rectType'

export interface Hashrule {
   request: (prop: RequestProp) => void
}

/**
 * @param automaton
 * The automaton to accelerate
 *
 * @param boiler
 * The boiler produces boiled content from content.
 * It can be used to do pattern recognition.
 *
 * @param topologyContext
 *
 * Precise description of the topology, down to the exact values of the cells
 * of the borders.
 *
 * TopologyContext provide a `.hash` which changes if some content changed
 *
 */
export type HashruleCreatorFunction = (
   automaton: ExternalAutomaton,
) => (boiler: Boiler) => (topologyContext: TopologyContext) => Hashrule

export interface RequestProp {
   /**
    * The region that must be covered by the data sent to the output function
    */
   rect: Rect
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

// export type DrawFunction = (input: BoiledContent, image: ImageData) => void

export type OutputFunction = (image: ImageData, region: Rect) => void

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
