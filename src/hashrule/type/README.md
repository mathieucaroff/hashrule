# Hashrule types

## boardType

A board is a slice of cells

## boilerType

A boiler is mostly a function able to process a region of the automaton to detect and tag certain patterns

## borderType

A border the description of an infinit list of state to give to border cells depending on their position. The infinit is acheived by cycling on a finite list.

Border descriptors can described states as the result of a random test with weighted probability.

## cellType

A cell is the concept of a board i.e. a slice of cells, with added information in the form of a cell context, to allow the cell to be computed.

The cell context includes information like:

- global id getter function
- floating VS anchored cell

In the case of an anchored cell, it includes information like:

- location of the cell
- presence of borders, either horizontal or vertical, inside the cell
- presence of divine interventions

## hashruleType

A hashrule instance is associated to a single automaton.

Given

## locationType

## pairType

## patternType

## policyType

## randomMapper

## rectType

## topologyType

## old types

- automatonType
- oldCellType
