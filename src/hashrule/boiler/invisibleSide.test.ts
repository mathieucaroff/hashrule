import { default as ava } from 'ava'
import { invisibleLeft, invisibleRight } from './invisibleSide'

let pA = { visibility: 'hidden', type: 'set', width: 4 } as any
let pB = { visibility: 'visible', type: 'set', width: 3 } as any
let pC = { visibility: 'visible', type: 'group', content: [pA, pB] } as any
let pD = { visibility: 'visible', type: 'group', content: [pB, pA] } as any
let pE = { visibility: 'visible', type: 'group', content: [pA, pA, pB] } as any
let pF = { visibility: 'visible', type: 'group', content: [pB, pA, pA] } as any
let pG = { visibility: 'visible', type: 'group', content: [pB, pB, pA] } as any

ava('invisibleSide left', (t) => {
   t.is(invisibleLeft([pA]), 4)
   t.is(invisibleLeft([pB]), 0)
   t.is(invisibleLeft([pC]), 4)
   t.is(invisibleLeft([pD]), 0)
   t.is(invisibleLeft([pE]), 8)
   t.is(invisibleLeft([pF]), 0)
   t.is(invisibleLeft([pG]), 0)

   t.is(invisibleLeft([pA, pA]), 8)
   t.is(invisibleLeft([pA, pB]), 4)
   t.is(invisibleLeft([pB, pA]), 0)
   t.is(invisibleLeft([pB, pB]), 0)
})

ava('invisibleSide right', (t) => {
   t.is(invisibleRight([pA]), 4)
   t.is(invisibleRight([pB]), 0)

   t.is(invisibleRight([pA, pB]), 0)
   t.is(invisibleRight([pB, pA]), 4)
})
