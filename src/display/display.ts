import { Region } from '../util/region'

export interface Display {
   put: (image: ImageData, region: Region) => void
}

export interface DisplayProp {
   canvas: HTMLCanvasElement
}

let w: any = window

export let createDisplay = (prop: DisplayProp): Display => {
   let { canvas } = prop
   let ctx0 = canvas.getContext('2d')
   if (!ctx0) {
      throw new Error()
      // ctx is null
   }
   let ctx = ctx0

   let a = 0
   return {
      put: (image, region) => {
         if (a == 0) {
            w.image = image
            w.region = region
            w.ctx = ctx
         }
         a++
         w.a = a
         ctx.putImageData(image, region.x, region.y)
      },
   }
}
