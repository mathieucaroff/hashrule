import { createDisplay } from '../display/display'
import { createHashlife } from '../hashlife'
import { initPage } from '../page/init'
import { createPatternBoiler } from '../patternBoiler'
import { createRandomMapper } from '../randomMapper'
import { ruleToAutomaton } from '../ruleToAutomaton'
import { randrange } from '../util/randrange'
import { schedule } from './lib/schedule'
import { DrawFunction } from '../hashlifeType'
import { Region } from '../util/region'

let w: any = window

export let main = () => {
   let { canvas } = initPage()

   //
   canvas.width = 100
   canvas.height = 200

   let display = createDisplay({
      canvas,
   })

   let draw: DrawFunction = (input) => {
      let width = input[0].length
      let image = new ImageData(width, input.length)

      input.forEach((line, y) => {
         line.forEach((point, x) => {
            let k = 4 * (y * width + x)
            let color = point.state === 1 ? 255 : point.state === 0 ? 0 : 128

            image.data[k + 0] = color
            image.data[k + 1] = color
            image.data[k + 2] = color

            image.data[k + 3] = 255
         })
      })

      return image
   }

   let neighborhoodSize = 3
   let hashlife = createHashlife({
      automaton: ruleToAutomaton({
         dimension: 1,
         neighborhoodSize,
         number: 110,
         stateCount: 2,
      }),
      boiler: createPatternBoiler({
         patternList: [],
      }), // TODO later
      draw,
      random: createRandomMapper({
         randrange,
         seedString: '_',
      }),
   })

   let t = 0
   let render = () => {
      hashlife.request({
         region: Region.fromRect({
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
         }),
         output: display.put,
      })
      t++
   }

   let mainLoop = schedule(render, requestAnimationFrame)

   mainLoop()

   w.canvas = canvas
   w.hashlife = hashlife
   w.draw = draw
}
