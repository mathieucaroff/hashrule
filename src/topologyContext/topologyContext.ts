import {
   DivineInterventionDescriptor,
   HorizontalBorderDescriptor,
   TopologyContext,
   VerticalBorderDescriptor,
} from '../hashrule/type/locationType'
import { TopologyInfiniteBoth } from '../hashrule/type/topologyType'
import { randomInteger } from '../util/randomInteger'
import { activateTopology } from './activateTopology'

export interface TopologyContextProp {
   divineInterventionList: DivineInterventionDescriptor[]
   seedString: string
   topology: TopologyInfiniteBoth
}

let hashDivine = (divine: DivineInterventionDescriptor): string => {
   let { x, y, state } = divine
   return `${x}+${y}:${state}`
}

let hashDivineList = (divineList: DivineInterventionDescriptor[]): string => {
   let list = [...divineList]
   list.sort((a, b) => {
      if (a.y == b.y) {
         if (a.x == b.x) {
            return 0
         }

         return -1 + 2 * +(a.x > b.x)
      }

      return -1 + 2 * +(a.y > b.y)
   })

   return list.map(hashDivine).join('+')
}

let getHash = ({ hash }: { hash: string }): string => hash

export let createTopologyContext = (prop: TopologyContextProp) => {
   let { divineInterventionList, topology, seedString } = prop

   let activeTopology = activateTopology({
      topology,
      seedString,
   })
   let { horizontalGenesisBorder, externalVerticalBorderList } = activeTopology

   let horizontalBorderList: HorizontalBorderDescriptor[] = [
      horizontalGenesisBorder,
   ]
   let verticalBorderList: VerticalBorderDescriptor[] = [
      ...externalVerticalBorderList,
   ]

   let hash = [
      hashDivineList(divineInterventionList),
      horizontalBorderList.map(getHash).join('--'),
      verticalBorderList.map(getHash).join(':'),
   ].join(';')

   let topologyContext: TopologyContext = {
      divineInterventionList,
      hash,
      horizontalBorder: horizontalBorderList,
      verticalBorder: verticalBorderList,
   }

   return topologyContext
}
