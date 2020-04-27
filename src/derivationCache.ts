import { Cell } from './cellType'
import { Region } from './util/region'

export interface CcdoProp<TCell extends Cell, TDeriv> {
   derivate: (cell: TCell) => TDeriv
   output: (data: TDeriv, region: Region) => void
}

export type Ccdo<TCell> = (cell: TCell, region: Region) => void

export let derivationCache = <TDeriv>() => {
   let cache: Record<number, TDeriv> = []

   return <TCell extends Cell>(prop: CcdoProp<TCell, TDeriv>): Ccdo<TCell> => {
      let { derivate, output } = prop

      return (cell: TCell, region: Region): void => {
         if (cache[cell.id] === undefined) {
            cache[cell.id] = derivate(cell)
         }
         output(cache[cell.id], region)
      }
   }
}
