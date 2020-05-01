import { createDisplay } from '../display/display'
import { createPatternBoiler } from '../hashrule/boiler/patternBoiler'
import { createHashrule } from '../hashrule/hashrule'
import { randomInteger } from '../hashrule/random/randomInteger'
import { createRandomMapper } from '../hashrule/random/randomMapper'
import { StochasticState } from '../hashrule/type/borderType'
import { DrawFunction } from '../hashrule/type/hashlifeType'
import { Region } from '../hashrule/type/rectType'
import { initPage } from '../page/init'
import { ruleToAutomaton } from '../rule/ruleToAutomaton'
import { schedule } from './lib/schedule'

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
      console.log('DRAW', input[0].slice(0, 5))

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

   let zero: StochasticState = {
      total: 2,
      cumulativeMap: [1, 0],
   }

   let neighborhoodSize = 3
   let hashlife = createHashrule({
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
         randomInteger: randomInteger,
         seedString: '_',
      }),
      topology: {
         finitness: 'infinite',
         kind: 'both',
         genesis: {
            kind: 'top',
            center: [],
            cycleLeft: [zero],
            cycleRight: [zero],
         },
      },
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
