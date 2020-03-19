export let schedule = (
   run: () => void,
   schedulerFunction: (run: () => void) => void,
) => {
   let loop = () => {
      run()
      schedulerFunction(loop)
   }

   return loop
}
