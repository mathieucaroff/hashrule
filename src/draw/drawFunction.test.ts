/**
 * Make an imageData out of some boiled content
 */

import ava from 'ava'

import { drawFunction, black, majenta, red, whitish } from './drawFunction'

let createImageData = (w: number, h: number) => {
   let image: ImageData = {
      data: new Uint8ClampedArray({ length: 4 * w * h }),
      width: w,
      height: h,
   }
   return image
}

ava('drawFunction can be run', (t) => {
   drawFunction([[]], createImageData(0, 1))

   t.pass()
})

ava('drawFunction works with a dead cell', (t) => {
   let image = createImageData(1, 1)

   drawFunction([[{ state: 0, patternNumber: 0 }]], image)

   t.deepEqual(image.data, new Uint8ClampedArray([0, 0, 0, 255]))
})

ava('drawFunction works with a living cell', (t) => {
   let image = createImageData(1, 1)

   drawFunction([[{ state: 1, patternNumber: 0 }]], image)

   t.deepEqual(image.data, new Uint8ClampedArray([...whitish, 255]))
})

ava('drawFunction works with a void cell', (t) => {
   let image = createImageData(1, 1)

   drawFunction([[{ state: -1, patternNumber: 0 }]], image)

   t.deepEqual(image.data, new Uint8ClampedArray([...red, 255]))
})

ava('drawFunction works with a unexpected cell', (t) => {
   let image = createImageData(1, 1)

   drawFunction([[{ state: -2, patternNumber: 0 }]], image)

   t.deepEqual(image.data, new Uint8ClampedArray([...majenta, 255]))
})
