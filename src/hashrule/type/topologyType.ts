import {
   TopBorderDescriptor,
   SideBorderDescriptor,
   BorderDescriptor,
} from './borderType'

export type Side = 'left' | 'right'

interface __TopologyBase {
   genesis: TopBorderDescriptor
}

interface __TopologyFiniteBase extends __TopologyBase {
   finitness: 'finite'
   width: number
}

/**
 * A topology a border on each side
 */
export interface TopologyFiniteBorder extends __TopologyFiniteBase {
   kind: 'border'
   borderLeft: SideBorderDescriptor
   borderRight: SideBorderDescriptor
}

/**
 * A borderless looping topology
 */
export interface TopologyFiniteLoop extends __TopologyFiniteBase {
   kind: 'loop'
}

/**
 * A topology with two borders, the porous one allowing the information
 * from the other side to sink through
 */
export interface TopologyFinitePorous extends __TopologyFiniteBase {
   kind: 'porous'
   porousness: Side
   borderOther: SideBorderDescriptor
}

/**
 * Any topology that is finite
 */
export type TopologyFinite =
   | TopologyFiniteBorder
   | TopologyFiniteLoop
   | TopologyFinitePorous

/**
 * A topology that is infinite on the right and on the left
 */
export interface TopologyInfiniteBoth extends __TopologyBase {
   finitness: 'infinite'
   kind: 'both'
}

/**
 * A topology that is infinite on one of it's two sides
 */
export interface TopologyInfiniteSemi extends __TopologyBase {
   finitness: 'infinite'
   kind: 'semi'
   infinite: Side
   borderOther: BorderDescriptor
}

/**
 * A topology that is infinite in some way
 */
export type TopologyInfinite = TopologyInfiniteBoth | TopologyInfiniteSemi

export type Topology = TopologyFinite | TopologyInfinite
