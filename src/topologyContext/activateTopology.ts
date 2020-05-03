import {
   StochasticState,
   TopBorderDescriptor,
   State,
} from '../hashrule/type/borderType'
import {
   HorizontalBorderDescriptor,
   VerticalBorderDescriptor,
} from '../hashrule/type/locationType'
import { TopologyInfiniteBoth } from '../hashrule/type/topologyType'
import { modGet } from '../util/mod'
import { RandomInteger, randomInteger } from '../util/randomInteger'
import { Pair } from '../hashrule/type/pairType'

export interface ActivateTopologyProp {
   seedString: string
   topology: TopologyInfiniteBoth
}

export interface ActiveTopology {
   horizontalGenesisBorder: HorizontalBorderDescriptor
   externalVerticalBorderList: VerticalBorderDescriptor[]
}

/**
 * Convert a topology, together with a seed into an active topology
 *
 * @param seedString the seed
 * @param topology the topology to convert
 */
export let activateTopology = (prop: ActivateTopologyProp) => {
   let { topology, seedString } = prop

   let sliceCount = 3
   let shortStochastic = (k: number) => {
      return stochasticSlice(randomInteger, seedString, k, sliceCount)
   }

   let randomMap = {
      top: shortStochastic(0),
      left: shortStochastic(1),
      right: shortStochastic(2),
   }

   let horizontalGet = (pos: Pair): number => {
      if (pos.y !== 0) throw new Error()

      let { x } = pos
      let { center, cycleLeft, cycleRight } = topology.genesis

      let stochastic: StochasticState

      let cx = Math.floor(center.length / 2) + x
      if (0 <= cx && cx < center.length) {
         stochastic = center[cx]
      } else if (cx < 0) {
         let xx = -cx - 1
         stochastic = modGet(cycleLeft, xx)
      } else if (cx >= center.length) {
         let xx = cx - center.length
         stochastic = modGet(cycleRight, xx)
      } else throw new Error()

      return randomMap.top(x, stochastic)
   }

   let activeTopology: ActiveTopology = {
      externalVerticalBorderList: [],
      horizontalGenesisBorder: {
         y: 0,
         hash: hashTopBorder(topology.genesis),
         get: horizontalGet,
      },
   }

   return activeTopology
}

/**
 * stochasticSlice
 *
 * Helper function to compute seedInt from a position so as to have a number
 * of slices of independant random.
 *
 * @param randomInteger provide your own randomInteger function
 * @param seedString the base seed to use for the random
 * @param k the index of the slice
 * @param sliceCount the total number of slices
 *
 * stochasticSlice()
 *
 * @param pos The x or y coordinate of the cell
 * @param stochastic The description the odds for each possible random state
 */
export let stochasticSlice = (
   randomInteger: RandomInteger,
   seedString: string,
   k: number,
   sliceCount: number,
) => {
   return (pos: number, stochastic: StochasticState): State => {
      if (stochastic.kind === 'deterministic') {
         return stochastic.state
      }

      let seedInt = pos * sliceCount + k
      let rangeSize = stochastic.total
      let randomValue = randomInteger(seedString, seedInt, rangeSize)

      let selectedState = 0
      stochastic.cumulativeMap.some((v, k) => {
         selectedState = k
         return v > randomValue
      })
      // break from the loop when the selected state corresponds to the random
      // value

      return selectedState
   }
}

/**
 * Provide a hash for the stochastic state
 *
 * @param stock The stochastic state
 */
export let hashStocasticState = (stock: StochasticState): string => {
   if (stock.kind === 'deterministic') {
      return '' + stock.state
   }
   return stock.cumulativeMap.join(',')
}

/**
 * Provide a hash for a top border descriptor
 *
 * @param border The border
 */
export let hashTopBorder = (border: TopBorderDescriptor) => {
   let { center, cycleLeft, cycleRight } = border
   return [center, cycleLeft, cycleRight]
      .map((li) => li.map(hashStocasticState).join('_'))
      .join('___')
}
