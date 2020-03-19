// import { Explorer, ExplorerProp, DescendProp } from './explorerType'
// import { createPolicy } from '../policy'
// import { Cell } from '../cellType'
// import { Region } from '../util/region'

// /**
//  * See dispatch schema README.md
//  *
//  * Explorer is able to go through the cell tree with the following methods:
//  *
//  * - request (which caches image-s in imageMap)
//  * - putBoiledContent (which caches boiledContent-s in boiledContentMap)
//  * - putContent
//  *
//  * It is responsible of caching the intermediate results for `boiledContent` and
//  * `image`, and discarding these when needed.
//  */
// export let createExplorer = (explorerProp: ExplorerProp): Explorer => {
//    let { boiler, draw } = explorerProp
//    let boilLevel = 0

//    let policy = createPolicy(boilLevel)

//    let imageCache: Record<number, ImageData> = []

//    let descend = (descendProp: DescendProp) => {
//       // TODO
//       let { cell } = descendProp
//       if (cell.automaton.level <= policy.imageLevel) {
//          explorerOutput(descendProp)
//       } else {
//          let { cell, region, output } = descendProp
//          propagate({ cell, region, info: { output }, callback: descend })
//       }

//       if (cell.type === 'air') {
//          let { left, right } = cell
//       }

//       // let zero = {
//       //    state: 0,
//       //    patternNumber: 0,
//       // }

//       // let one = {
//       //    state: 1,
//       //    patternNumber: 0,
//       // }

//       // let boiledContent: BoiledContent = new Array(area.size.y)
//       //    .fill(0)
//       //    .map(() =>
//       //       new Array(area.size.x)
//       //          .fill(0)
//       //          .map(() => (Math.random() > 0.95 ? zero : one)),
//       //    )

//       // output(explorerProp.draw(boiledContent), {
//       //    x: area.size.x / 2,
//       //    y: area.size.y / 2,
//       // })
//       //
//    }

//    interface CellRegion {
//       cell: Cell
//       region: Region
//    }

//    interface PropagageProp<T> extends CellRegion {
//       info: T
//       callback: (prop: CellRegion & T) => void
//    }

//    let propagate = <T>(prop: PropagageProp<T>) => {
//       // TODO
//       let { cell, region, info, callback } = prop
//       callback({ cell, region, ...info })
//    }

//    let explorerOutput = (prop: DescendProp) => {
//       let { cell, output, region } = prop
//       if (!(cell.id in imageCache)) {
//          imageCache[cell.id] = explorerImageData(prop)
//       }
//       output(imageCache[cell.id], region)
//    }

//    let explorerImageData = (prop: DescendProp): ImageData => {
//       let { cell } = prop
//       let imageWidth = cell.automaton.size / 2
//       let imageHeight = 2 ** (cell.automaton.level - 1)
//       let imageData = new ImageData(imageWidth, imageHeight)
//       putBoiledContent()
//       // propagate({ cell, region }, ({ cell, region }) => ({ cell, region }))
//       return imageData
//    }

//    let putBoiledContent = () => {
//       // TODO
//    }

//    let putContent = () => {
//       // TODO
//    }

//    return {
//       descend,
//    }
// }
