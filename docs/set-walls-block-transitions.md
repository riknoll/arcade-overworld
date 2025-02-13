# set walls block transitions

This controls whether the walls in a destination tilemap will stop the player from moving into that map. By default, this setting is **off**.

If set to on, the player sprite will only move between maps if the location they would be placed in the destination map has room for the sprite to fit without overlapping any walls. For a more detailed explanation, read [this](https://github.com/riknoll/arcade-overworld?tab=readme-ov-file#transitioning-between-maps).

```sig
overworld.setWallsBlockTransitions(false)
```

## Parameters

* **enabled**: True to enable this setting. False to disable it

## Example #example

```blocks
```

```package
arcade-overworld=github:riknoll/arcade-overworld
```