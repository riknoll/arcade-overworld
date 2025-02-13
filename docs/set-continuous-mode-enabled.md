# set continuous mode enabled

Enables "continuous mode" when set to true. In continuous mode, all of the tilemaps in the overworld grid are combined into one giant tilemap. This setting is **off** by default.

>Note: to use continuous mode, all tilemaps in the overworld need to have the exact same width and height! They also need to use the same tile size; no mixing 16x16 and 8x8 tiles!

```sig
overworld.setContinuousModeEnabled(false)
```

Continuous mode can be useful if you want to make tilemaps that are larger than the maximum tilemap dimensions. You can also use this to bypass the limit of 255 tiles per tilemap, but that might cause some bugs so I wouldn't recommend it!

You might also use continuous mode if you want to reuse tilemaps inside of a bigger map. For example, if you were procedurally generating a dungeon you might want to use the same map for all of your hallways between rooms.

When using continuous mode, the animation and transition blocks are disabled since there is no switching between tilemaps. However, you can still use the "on map loaded" event to figure out when the player moves between tilemaps. Likewise, the "overworld location" block will still return the column/row of the current sprite in the overworld grid.

## Parameters

* **enabled**: True to enable continuous mode or false to disable it.

## Example #example

```blocks
```

```package
arcade-overworld=github:riknoll/arcade-overworld
```