import { Rect } from '../hashrule/type/rectType'

export interface Display {
   put: (image: ImageData, region: Rect) => void
}

export interface DisplayProp {
   canvas: HTMLCanvasElement
}

let w: any = window

export let createDisplay = (prop: DisplayProp): Display => {
   let { canvas } = prop
   let ctx0 = canvas.getContext('2d')
   if (!ctx0) throw new Error() // ctx is null
   let ctx = ctx0

   let a = 0
   return {
      put: (image, rect) => {
         // console.log('Display.PUT')
         if (a == 0) {
            w.image = image
            w.rect = rect
            w.ctx = ctx
         }
         a++
         w.a = a
         ctx.putImageData(image, rect.x, rect.y)
      },
   }
}
