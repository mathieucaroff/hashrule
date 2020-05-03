export type State = number

export type StochasticState =
   | RandomStochasticState
   | DeterministicStochasticState

export interface RandomStochasticState {
   kind: 'random'
   cumulativeMap: number[]
   total: number
}

export interface DeterministicStochasticState {
   kind: 'deterministic'
   state: State
}

export type BasePattern = StochasticState[]

export interface SideBorderDescriptor {
   kind: 'side'
   init: BasePattern
   cycle: BasePattern
}

export interface TopBorderDescriptor {
   kind: 'top'
   center: BasePattern
   cycleLeft: BasePattern
   cycleRight: BasePattern
}

export type BorderDescriptor = SideBorderDescriptor | TopBorderDescriptor
