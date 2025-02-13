# map exists in direction

Used to check if there is a map in the given direction from the currently loaded location in the overworld. In other words, if this function returns false, it means that the player has reached the edge of the overworld and can't move further in that direction.

```sig
overworld.mapExistsInDirection(CollisionDirection.Left)
```

## Parameters

* **direction**: The direction to check for a tilemap in

## Example #example

```blocks
```

```package
arcade-overworld=github:riknoll/arcade-overworld
```