import { h } from './lib/hyper'

export let initPage = () => {
   function append(x) {
      document.body.appendChild(x)
   }

   let canvas = h('canvas', {
      style: 'border: 1px solid aqua;',
   })

   append(h('h1', { textContent: 'HashRule' }))
   append(canvas)

   return { canvas }
}
