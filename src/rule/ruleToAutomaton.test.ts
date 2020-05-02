import { default as ava } from 'ava'
import { ruleToAutomaton } from './ruleToAutomaton'

ava('Works for rule 255', (t) => {
   let automaton = ruleToAutomaton({
      neighborhoodSize: 3,
      number: 255,
      stateCount: 2,
   })

   t.is(automaton.localRule([0, 0, 0]), 1)
   t.is(automaton.neigboorhoodSize, 3)
   t.is(automaton.stateCount, 2)
})
