import { Region } from './region'

export let putFunction = <T>(buffer: T[][]) => {
   return (data: T[][], region: Region) => {
      let sy = data.length
      let sx = data[0].length
      try {
         for (let ky = 0, y = region.y; ky < sy; ky++, y++) {
            for (let kx = 0, x = region.x; kx < sx; kx++, x++) {
               buffer[y][x] = data[ky][kx]
            }
         }
      } catch (e) {
         debugger
         throw e
      }
   }
}
