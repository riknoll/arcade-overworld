# on map loaded

Runs some code whenever a new map is loaded by the overworld extension. This is great for doing things like spawning sprites and destroying sprites from the previous tilemap.

```sig
overworld.onMapLoaded(function (overworldColumn, overworldRow, map) {
	
})
```

In "continuous mode", this block will still fire whenever the player sprite enters a new tilemap in the grid. This is great for doing things like lazily loading sprites when the player gets close.

## Parameters

* **overworldColumn**: The column in the overworld grid where the loaded tilemap is located
* **overworldRow**: The row in the overworld grid where the loaded tilemap is located
* **map**: The tilemap that was loaded

## Example #example

```blocks
```

```package
arcade-overworld=github:riknoll/arcade-overworld
```