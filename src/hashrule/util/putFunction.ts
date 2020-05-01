import { Region } from '../type/rectType'

/**
 * putFunction
 *
 * Given a buffer, returns a function with puts some data at some position in
 * the buffer
 *
 * @param buffer The buffer to fill
 * @param data The data to use to fill it
 * @param region The location of the buffer compared to where the data should be
 *        be put
 */
export let putFunction = <T>(buffer: T[][]) => {
   return (data: T[][], region: Region) => {
      let sky = data.length
      let skx = data[0].length

      // y0, x0
      // location of the data, relative to the buffer
      let y0 = -region.y - sky + 1
      let x0 = -region.x - skx / 2

      if (y0 < 0) {
         y0 = 0
      }
      if (x0 < 0) {
         x0 = 0
      }

      console.assert(buffer.length === region.size.y)
      console.assert(buffer[0].length === region.size.x)
      let sy = buffer.length
      let sx = buffer[0].length

      // (x, y) pointer location for the buffer
      // (kx, ky) pointer location for the data
      // try {
      for (let ky = 0, y = y0; ky < sky && y < sy; ky++, y++) {
         for (let kx = 0, x = x0; kx < skx && x < sx; kx++, x++) {
            buffer[y][x] = data[ky][kx]
         }
      }
      // } catch (e) {
      //    console.log(e)
      //    debugger
      //    throw e
      // }
   }
}
