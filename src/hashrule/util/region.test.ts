import ava from 'ava'
import { Region, Frame, Area, Rect } from './region'

ava('Area.fromRect 0, 0, 1, 2', (t) => {
   let rect = {
      x: 0,
      y: 0,
      width: 1,
      height: 2,
   }

   let area = Area.fromRect(rect)

   t.deepEqual(area.center, { x: 1, y: 1 }, 'center')
   t.deepEqual(area.size, { x: 1, y: 2 })
})

ava('Frame.fromRect 0, 0, 1, 2', (t) => {
   let rect = {
      x: 0,
      y: 0,
      width: 1,
      height: 2,
   }

   let frame = Frame.fromRect(rect)

   t.deepEqual(frame, {
      xleft: 0,
      xright: 1,
      ytop: 0,
      ybottom: 2,
   })
})

ava.skip('non-atomic tests', () => {
   ava('Region.fromArea vs Region.fromRect 0, 0, 0, 0', (t) => {
      t.deepEqual(
         Region.fromArea({
            center: { x: 0, y: 0 },
            size: { x: 0, y: 0 },
         }),
         Region.fromRect({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
         }),
      )
   })

   ava('Region.fromArea.rect 0, 0, 1, 0', (t) => {
      t.deepEqual(
         Region.fromArea({
            center: { x: 0, y: 0 },
            size: { x: 1, y: 0 },
         }).rect,
         {
            x: -1,
            y: 0,
            width: 1,
            height: 0,
         },
      )
   })

   ava('Region.fromRect.area 0, 0, 1, 0', (t) => {
      let area = {
         center: { x: 0, y: 0 },
         size: { x: 1, y: 0 },
      }

      t.deepEqual(Region.justArea(Region.fromRect(Region.fromArea(area))), area)
   })

   ava('Frame.fromArea . Region.fromFrame.area 0, 0, 1, 0', (t) => {
      let area = {
         center: { x: 0, y: 0 },
         size: { x: 1, y: 0 },
      }

      t.deepEqual(Region.justArea(Region.fromFrame(Frame.fromArea(area))), area)
   })
})
