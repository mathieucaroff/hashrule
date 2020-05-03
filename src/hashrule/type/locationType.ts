import { Pair } from './pairType'

export interface FloatingLocation {
   type: 'floating'
}

export interface AnchoredLocation {
   type: 'anchored'
   pos: Pair
   topologyContext: TopologyContext
}

export type CellLocation = FloatingLocation | AnchoredLocation

export interface TopologyContext {
   horizontalBorder: HorizontalBorderDescriptor[]
   verticalBorder: VerticalBorderDescriptor[]
   divineInterventionList: DivineInterventionDescriptor[]
   hash: string
}

/**
 * @param hash A hash for the get() function
 */
export interface HorizontalBorderDescriptor {
   y: number
   get: (pos: Pair) => number
   hash: string
}

export interface VerticalBorderDescriptor {
   x: number
   width: number
   get: (pos: Pair) => number
   hash: string
}

export interface DivineInterventionDescriptor {
   x: number
   y: number
   state: number
}
