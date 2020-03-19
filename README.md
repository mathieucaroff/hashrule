# HashRule

## How to implement

### Step 1 - Create the automata

...with memoized result function, and memoized fusion (via hash table)

What about magic cells?

...do them too.

### Step 2 - Create the initial cells and the cell sizing logic

They are mostly magic cells, with awareness of their location, and a reference
to the random function

### Step 3 - Create the draw algorithm (request)

### Step 4 - Draw to a real canvas

- Instanciate image of the right size
- Execute `.request()`, with that image as parameter
- Use `.putImageData`

### Step 5 - Add the imageLevel

...where images are pre-rendered.

- Make sure the cache is invalidated when needs be.

### Step 6 - Write a boiler function

Able to produce a `2n x n` boiled image, from a `4n x 2n` image.

### Step 7 - Add the boilingLevel

...where images are boiled. Also add the boiler function

- Make sure the cache is invalidated when needs be.
