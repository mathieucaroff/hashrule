# Hashlife

## Draw dispatch schema

- Each `V` separates a cell level (an automaton `|`) from it's child.

```C#
| me.descend(area, draw, output)
V
| me.descend
V
| me.descend
V
| {@policy.imageLevel} ->>
| descend.output({ image: me.image, area })
| me.image =>> descend.draw(me.boiledContent)
| me.boiledContent <=> me.putBoiledContent
V
| me.putBoiledContent
V
| me.putBoiledContent
V
| {@policy.boilLevel} ->>
| me.boiledContent =>> boil(me.content)
| me.content <=> me.putContent(area, draw, output)
V
| me.putContent
V
| me.putContent
V
GROUND me.putContent
```

## Alternative dispatch schema

```C#

exploreImage = makeExplore(policy.imageLevel)
exploreBoiled = makeExplore(policy.boilLevel)
exploreContent = makeExplore(willGetContent, 0)

| exploreImage(cell, area, willOutput[draw, outpt])
V
| exploreImage(cell_, area__, willOutput[draw, outpt])
V
| exploreImage(cell__, area__, willOutput[draw, outpt])
V
| {@policy.imageLevel} ->>
|
| willOutput[boiler, draw, outpt] :: (cell, area) => {
|   outpt(memoizedDraw(cell), area)
| }
|
| memoizedDraw :: memoize(drawFunction, { on: ({ id }) => id })
|
| drawFunction :: (cell) => {
|     boiledContentBuffer = createBuffer(getSize(cell))
|     exploreBoiled()
|     return draw(boiledContentBuffer)
| }
// | descend.output({ image: me.image, area })
// | me.image =>> descend.draw(me.boiledContent)
// | me.boiledContent <=> me.putBoiledContent
V
| exploreBoiled(cell, area, willBoil[boiler, ])
V
| exploreBoiled(cell-, area-, willBoil[boiler, ])
V
| {@policy.boilLevel} ->>
| me.boiledContent =>> boil(me.content)
| me.content <=> me.putContent(area, draw, output)
V
| exploreContent(cell, contentBuffer)
V
| exploreContent(cell:, contentBuffer:)
V
GROUND
| willGetContent(cell::, contentBuffer::)
| // willGetContent:
| // Copy the content of the ground cells into the contentBuffer
| // at the right location
```

## Alternative alternative dispatch schema

```C#

exploreImage = makeExplore(policy.imageLevel)
exploreBoiled = makeExplore(policy.boilLevel)
exploreContent = makeExplore(willGetContent, 0)

| exploreImage(cell, area, willOutput[draw, outpt])
V
| exploreImage(cell_, area__, willOutput[draw, outpt])
V
| exploreImage(cell__, area__, willOutput[draw, outpt])
V
| {@policy.imageLevel} ->>
|
| willOutput[boiler, draw, outpt] :: (cell, area) => {
|   outpt(memoizedDraw(cell), area)
| }
|
| memoizedDraw :: memoize(drawFunction, { on: ({ id }) => id })
|
| drawFunction :: (cell) => {
|     boiledContentBuffer = createBuffer(getSize(cell))
|     exploreBoiled()
|     return draw(boiledContentBuffer)
| }
// | descend.output({ image: me.image, area })
// | me.image =>> descend.draw(me.boiledContent)
// | me.boiledContent <=> me.putBoiledContent
V
| exploreBoiled(cell, area, willBoil[boiler, ])
V
| exploreBoiled(cell-, area-, willBoil[boiler, ])
V
| {@policy.boilLevel} ->>
| me.boiledContent =>> boil(me.content)
| me.content <=> me.putContent(area, draw, output)
V
| exploreContent(cell, contentBuffer)
V
| exploreContent(cell:, contentBuffer:)
V
GROUND
| willGetContent(cell::, contentBuffer::)
| // willGetContent:
| // Copy the content of the ground cells into the contentBuffer
| // at the right location
```
