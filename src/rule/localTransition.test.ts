import { default as ava } from 'ava'
import { localTransition } from './localTransition'

ava('Works for rule 0', (t) => {
   let localFunction = localTransition({
      neighborhoodSize: 3,
      number: 0,
      stateCount: 2,
   })

   t.is(localFunction([0, 0, 0]), 0)
   t.is(localFunction([0, 0, 1]), 0)
   t.is(localFunction([0, 1, 0]), 0)
   t.is(localFunction([0, 1, 1]), 0)
   t.is(localFunction([1, 0, 0]), 0)
   t.is(localFunction([1, 0, 1]), 0)
   t.is(localFunction([1, 1, 0]), 0)
   t.is(localFunction([1, 1, 1]), 0)
})

ava('Works for rule 255', (t) => {
   let localFunction = localTransition({
      neighborhoodSize: 3,
      number: 255,
      stateCount: 2,
   })

   t.is(localFunction([0, 0, 0]), 1)
   t.is(localFunction([0, 0, 1]), 1)
   t.is(localFunction([0, 1, 0]), 1)
   t.is(localFunction([0, 1, 1]), 1)
   t.is(localFunction([1, 0, 0]), 1)
   t.is(localFunction([1, 0, 1]), 1)
   t.is(localFunction([1, 1, 0]), 1)
   t.is(localFunction([1, 1, 1]), 1)
})

ava('Works for identity rule 0b11001100', (t) => {
   let localFunction = localTransition({
      neighborhoodSize: 3,
      number: 0b11001100,
      stateCount: 2,
   })

   t.is(localFunction([0, 0, 0]), 0)
   t.is(localFunction([0, 0, 1]), 0)
   t.is(localFunction([0, 1, 0]), 1)
   t.is(localFunction([0, 1, 1]), 1)
   t.is(localFunction([1, 0, 0]), 0)
   t.is(localFunction([1, 0, 1]), 0)
   t.is(localFunction([1, 1, 0]), 1)
   t.is(localFunction([1, 1, 1]), 1)
})

ava('Works for all elementary rules', (t) => {
   Array.from({ length: 256 }, (_, number) => {
      let localFunction = localTransition({
         neighborhoodSize: 3,
         number,
         stateCount: 2,
      })

      let bin = number.toString(2).padStart(8, '0')
      let resultArray = [...bin].map((x) => +x)
      resultArray.reverse()

      t.is(localFunction([0, 0, 0]), resultArray[0])
      t.is(localFunction([0, 0, 1]), resultArray[1])
      t.is(localFunction([0, 1, 0]), resultArray[2])
      t.is(localFunction([0, 1, 1]), resultArray[3])
      t.is(localFunction([1, 0, 0]), resultArray[4])
      t.is(localFunction([1, 0, 1]), resultArray[5])
      t.is(localFunction([1, 1, 0]), resultArray[6])
      t.is(localFunction([1, 1, 1]), resultArray[7])
   })
})

ava('Works for the simple xor rule (6)', (t) => {
   let localFunction = localTransition({
      neighborhoodSize: 2,
      number: 6,
      stateCount: 2,
   })

   t.is(localFunction([0, 0]), 0)
   t.is(localFunction([0, 1]), 1)
   t.is(localFunction([1, 0]), 1)
   t.is(localFunction([1, 1]), 0)
})

ava('Works for the simple xand rule (9)', (t) => {
   let localFunction = localTransition({
      neighborhoodSize: 2,
      number: 9,
      stateCount: 2,
   })

   t.is(localFunction([0, 0]), 1)
   t.is(localFunction([0, 1]), 0)
   t.is(localFunction([1, 0]), 0)
   t.is(localFunction([1, 1]), 1)
})

ava('Works with neighboorhood size 4 for rule 1', (t) => {
   let localFunction = localTransition({
      neighborhoodSize: 4,
      number: 1,
      stateCount: 2,
   })

   t.is(localFunction([0, 0, 0, 0]), 1)
   t.is(localFunction([0, 0, 0, 1]), 0)
   t.is(localFunction([0, 0, 1, 0]), 0)
   t.is(localFunction([0, 1, 0, 0]), 0)
   t.is(localFunction([1, 0, 0, 0]), 0)
   t.is(localFunction([0, 1, 1, 1]), 0)
   t.is(localFunction([1, 0, 1, 1]), 0)
   t.is(localFunction([1, 1, 0, 1]), 0)
   t.is(localFunction([1, 1, 1, 0]), 0)
   t.is(localFunction([1, 1, 1, 1]), 0)
})

ava('Works with neighboorhood size 4 for rule 32767', (t) => {
   let localFunction = localTransition({
      neighborhoodSize: 4,
      number: 32767,
      stateCount: 2,
   })

   t.is(localFunction([0, 0, 0, 0]), 1)
   t.is(localFunction([0, 0, 0, 1]), 1)
   t.is(localFunction([0, 0, 1, 0]), 1)
   t.is(localFunction([0, 1, 0, 0]), 1)
   t.is(localFunction([1, 0, 0, 0]), 1)
   t.is(localFunction([0, 1, 1, 1]), 1)
   t.is(localFunction([1, 0, 1, 1]), 1)
   t.is(localFunction([1, 1, 0, 1]), 1)
   t.is(localFunction([1, 1, 1, 0]), 1)
   t.is(localFunction([1, 1, 1, 1]), 0)
})

ava('Works with neighboorhood size 4 for rule 32768', (t) => {
   let localFunction = localTransition({
      neighborhoodSize: 4,
      number: 32768,
      stateCount: 2,
   })

   t.is(localFunction([0, 0, 0, 0]), 0)
   t.is(localFunction([0, 0, 0, 1]), 0)
   t.is(localFunction([0, 0, 1, 0]), 0)
   t.is(localFunction([0, 1, 0, 0]), 0)
   t.is(localFunction([1, 0, 0, 0]), 0)
   t.is(localFunction([0, 1, 1, 1]), 0)
   t.is(localFunction([1, 0, 1, 1]), 0)
   t.is(localFunction([1, 1, 0, 1]), 0)
   t.is(localFunction([1, 1, 1, 0]), 0)
   t.is(localFunction([1, 1, 1, 1]), 1)
})

ava('Works with stateCount 3 for rule 9', (t) => {
   let localFunction = localTransition({
      neighborhoodSize: 2,
      number: 9,
      stateCount: 3,
   })

   t.is(localFunction([0, 0]), 0)
   t.is(localFunction([0, 1]), 0)
   t.is(localFunction([0, 2]), 1)
   t.is(localFunction([1, 0]), 0)
   t.is(localFunction([1, 1]), 0)
   t.is(localFunction([1, 2]), 0)
   t.is(localFunction([2, 0]), 0)
   t.is(localFunction([2, 1]), 0)
   t.is(localFunction([2, 2]), 0)
})
