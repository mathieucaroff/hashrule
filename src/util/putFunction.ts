import { Region } from './region'

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
      let sy = data.length
      let sx = data[0].length

      let y0 = -region.y - sy + 1
      let x0 = -region.x - sx / 2

      console.assert(sx % 2 === 0)
      console.assert(y0 >= 0, 'y0 >= 0')
      console.assert(x0 >= 0, 'x0 >= 0')
      console.assert(y0 + sy < buffer.length)
      console.assert(x0 + sx < buffer[0].length)

      try {
         for (let ky = 0, y = y0; ky < sy; ky++, y++) {
            for (let kx = 0, x = x0; kx < sx; kx++, x++) {
               buffer[y][x] = data[ky][kx]
            }
         }
      } catch (e) {
         console.log(e)
         debugger
         throw e
      }
   }
}
