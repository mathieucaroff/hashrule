/**
 * Make an imageData out of some boiled content
 */

import { DrawFunction } from '../hashrule/type/hashruleType'
import { BoiledContent } from '../hashrule/type/boilerType'

type Triplet = [number, number, number]

let colorMap: Triplet[] = []

export let red: Triplet = [255, 0, 0]
export let black: Triplet = [0, 0, 0]
export let whitish: Triplet = [255, 240, 220]
export let majenta: Triplet = [255, 255, 0]

colorMap[-1] = red
colorMap[0] = black
colorMap[1] = whitish

export let drawFunction: DrawFunction = (
   input: BoiledContent,
   image: ImageData,
) => {
   console.log(
      'DRAW',
      input.slice(0, 3).map((x) => x.slice(0, 4).map((p) => p.state)),
   )
   console.assert(input.length == image.height)
   if (input.length > 0) {
      console.assert(input[0].length == image.width)
   }

   let width = input?.[0]?.length ?? 0
   // let image = new ImageData(width, input.length)

   let { data } = image

   input.forEach((line, y) => {
      line.forEach((point, x) => {
         let color = colorMap[point.state] ?? majenta

         let k = 4 * (y * width + x)
         ;[data[k + 0], data[k + 1], data[k + 2]] = color
         data[k + 3] = 255
      })
   })
}
