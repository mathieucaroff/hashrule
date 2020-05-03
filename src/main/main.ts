import { createDisplay } from '../display/display'
import { createPatternBoiler } from '../hashrule/boiler/patternBoiler'
import { createHashrule } from '../hashrule/hashrule'
import { randomInteger } from '../util/randomInteger'
import { createRandomMapper } from '../random/randomMapper'
import { StochasticState } from '../hashrule/type/borderType'
import { Region } from '../hashrule/type/rectType'
import { initPage } from '../page/init'
import { ruleToAutomaton } from '../rule/ruleToAutomaton'
import { schedule } from './lib/schedule'
import { drawFunction } from '../draw/drawFunction'

let w: any = window

export let main = () => {
   let { canvas } = initPage()

   canvas.width = 100
   canvas.height = 200

   let display = createDisplay({
      canvas,
   })

   let zero: StochasticState = {
      total: 2,
      cumulativeMap: [1, 0],
   }

   let one: StochasticState = {
      total: 2,
      cumulativeMap: [0, 1],
   }

   let neighborhoodSize = 3
   let hashlife = createHashrule({
      automaton: ruleToAutomaton({
         neighborhoodSize,
         number: 110,
         stateCount: 2,
      }),
      boiler: createPatternBoiler({
         patternList: [],
      }), // TODO later
      draw: drawFunction,
      random: createRandomMapper({
         randomInteger: randomInteger,
         seedString: '_',
      }),
      topology: {
         finitness: 'infinite',
         kind: 'both',
         genesis: {
            kind: 'top',
            center: [one],
            cycleLeft: [zero],
            cycleRight: [zero],
         },
      },
   })

   let t = 0
   let render = () => {
      hashlife.request({
         rect: Region.fromRect({
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
}
