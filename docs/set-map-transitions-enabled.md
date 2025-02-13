# set map transitions enabled

This block allows you to temporarily disable the map transitioning behavior of the overworld extension. You can think of passing false to this function as turning overworld "off".

It's useful if you want to temporarily load a tilemap outside the tilemap grid (e.g. going inside a building like a shop). You can also use it to temporarily trap the player in the current room until they figure out a puzzle.

```sig
overworld.setMapTransitionsEnabled(false)
```

## Parameters

* **enabled**: True to enable map transitions, false to disable them

## Example #example

```blocks
```

```package
arcade-overworld=github:riknoll/arcade-overworld
```