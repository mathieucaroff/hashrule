import { default as ava } from 'ava'

import { Cell, createCell } from './cellget'

// ava('I always pass', (t) => {
//    t.pass()
// })

// ava('I always fail', (t) => {
//    t.fail()
// })

ava('Extract yourself', (t) => {
   let cell = createCell()
   t.is(
      cell.get({
         divisor: 2,
         widthNum: 2,
         tNum: 0,
         xNum: 0,
      }),
      cell,
   )
})

ava('Extract yourself with 4 divisions', (t) => {
   let cell = createCell()

   t.is(
      cell.get({
         divisor: 4,
         widthNum: 4,
         tNum: 0,
         xNum: 0,
      }),
      cell,
   )
})

ava('Extract your left part', (t) => {
   let cell = createCell()

   let left = createCell()
   cell.left = left

   t.is(
      cell.get({
         divisor: 4,
         widthNum: 2,
         tNum: 0,
         xNum: 0,
      }),
      left,
   )
})

ava('Extract your right part', (t) => {
   let cell = createCell()

   let right = createCell()
   cell.right = right

   t.is(
      cell.get({
         divisor: 4,
         widthNum: 2,
         tNum: 0,
         xNum: 2,
      }),
      right,
   )
})

ava('Extract your result', (t) => {
   let cell = createCell()

   let s: Cell = Symbol('s') as any

   cell.result = () => s

   t.is(
      cell.get({
         divisor: 4,
         widthNum: 2,
         tNum: 1,
         xNum: 1,
      }),
      s,
   )
})

ava('Extract your center', (t) => {
   let [a, b, c, d] = Array.from({ length: 4 }, () => createCell())

   let left = createCell(a, b)
   let right = createCell(c, d)

   let cell = createCell(left, right)

   let center = cell.get({
      divisor: 8,
      widthNum: 4,
      tNum: 0,
      xNum: 2,
   })

   t.is(center.left, b)
   t.is(center.right, c)
})
