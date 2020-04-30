import { Pair } from '../type/Pair'

/**
 * Area specified by the position of it's center, and it's horizontal and vertical sizes (width and height)
 *
 * If the width is even, it's evenly split on each side of the center. If the width is odd, the negative side is favored. Same goes for the height.
 */
export interface CenteredArea {
   center: Pair
   /**
    * @property {} size.x width
    * @property {} size.y height
    */
   size: Pair
}

/**
 * The absolute positions of each four sides of a frame
 *
 * xleft, position included
 * xright, excluded
 * ytop, position included
 * ybottom, excluded
 */
export interface Frame {
   xleft: number
   xright: number
   ytop: number
   ybottom: number
}

/**
 * Good old rectangle, defined by its width, height and x and y coordinates
 * of the top left corner
 */
export interface Rect {
   x: number
   y: number
   width: number
   height: number
}

export interface Region extends Rect, CenteredArea, Frame {
   area: CenteredArea
   corner: Pair
   rect: Rect
   frame: Frame
}

let expand = (area: CenteredArea, frame: Frame, rect: Rect): Region => ({
   ...area,
   ...frame,
   ...rect,
   area,
   frame,
   rect,
   corner: {
      x: rect.x,
      y: rect.y,
   },
})

export let Region = {
   fromRect: (rect: Rect): Region => {
      return expand(Area.fromRect(rect), Frame.fromRect(rect), rect)
   },
   fromFrame: (frame: Frame): Region => {
      let rect = Rect.fromFrame(frame)
      return expand(Area.fromRect(rect), frame, rect)
   },
   fromArea: (area: CenteredArea): Region => {
      let rect = Rect.fromArea(area)
      return expand(area, Frame.fromRect(rect), rect)
   },
   justArea: (region: Region) => {
      return {
         center: region.center,
         size: region.size,
      }
   },
   recenter: (region: Region, center: Pair): Region => {
      return Region.fromArea({
         center: center,
         size: region.size,
      })
   },
}

export let Area = {
   fromRect: (rect: Rect): CenteredArea => ({
      size: {
         x: rect.width,
         y: rect.height,
      },
      center: {
         x: rect.x + Math.ceil(rect.width / 2),
         y: rect.x + Math.ceil(rect.width / 2),
      },
   }),
}

export let Frame = {
   fromRect: (rect: Rect): Frame => ({
      xleft: rect.x,
      xright: rect.x + rect.width,
      ytop: rect.y,
      ybottom: rect.y + rect.height,
   }),
   fromArea: (area: CenteredArea): Frame => {
      let xleft = area.center.x - Math.floor(area.size.x / 2)
      let ytop = area.center.y - Math.floor(area.size.y / 2)

      return {
         xleft,
         xright: xleft + area.size.x,
         ytop,
         ybottom: ytop + area.size.y,
      }
   },
}

export let Rect = {
   fromFrame: (frame: Frame): Rect => ({
      x: frame.xleft,
      y: frame.ytop,
      width: frame.xright - frame.xleft,
      height: frame.ybottom - frame.ytop,
   }),
   fromArea: (area: CenteredArea): Rect => ({
      width: area.size.x,
      height: area.size.y,
      x: area.center.x - Math.ceil(area.size.x / 2),
      y: area.center.y - Math.ceil(area.size.y / 2),
   }),
}
