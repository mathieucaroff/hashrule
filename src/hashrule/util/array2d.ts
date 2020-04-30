export let createArray2d = <T>(sizey: number, sizex: number, val: T): T[][] => {
   return Array.from({ length: sizey }, () => {
      return Array(sizex).fill(val)
   })
}
