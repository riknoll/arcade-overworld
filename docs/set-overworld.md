# set overworld

Sets the current overworld. An overworld is a grid of tilemaps that the player sprite will move between when they approach the edge of the current map. Using this function will not cause the overworld to immediately take effect; make sure you use `load map` to load a tilemap from the grid!

```sig
overworld.setOverworld([])
```

The argument to this function is a double array of tilemaps. Each array inside the outer array represents one row of columns for the map.

## Parameters

* **map**: A double array of tilemaps

## Example #example

```blocks
```

```package
arcade-overworld=github:riknoll/arcade-overworld
```