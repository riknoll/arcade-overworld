# set player sprite

Sets the current player sprite. The player sprite is what controls when arcade-overworld moves between tilemaps. When the player sprite approaches the edge of the current tilemap, it will cause the next tilemap in that direction to load. For a more detailed explanation, read [this](https://github.com/riknoll/arcade-overworld?tab=readme-ov-file#transitioning-between-maps).

If you need to temporarily disable map transitions, you can use the `set map transitions enabled` block.

```sig
overworld.setPlayerSprite(null)
```

arcade-overworld is designed for single player games. If you want to use it with a multiplayer game, you'll either need to make one player the player sprite or use the `load map` and `load map in direction` blocks yourself to control the map transitions.

## Parameters

* **sprite**: The player sprite

## Example #example

```blocks
```

```package
arcade-overworld=github:riknoll/arcade-overworld
```