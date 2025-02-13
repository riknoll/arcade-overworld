# set map transitions radius

Sets the distance that the player sprite needs to be from the edge of a tilemap before a tilemap transition happens. By default, the radius is 4 pixels which means that the maps won't change until the player is 4 pixels or less from the edge of the map.

This radius only triggers if the player is moving towards the edge of the map. In other words, even if the player were placed all the way on the left edge of a tilemap, they would not trigger the transition to the tilemap in the left direction unless they actually have a negative x velocity (i.e. they are moving leftwards).

```sig
overworld.setMapTransitionRadius(4)
```

## Parameters

* **radius**: The distance from the edges of the map where the player sprite should start triggering map transitions

## Example #example

```blocks
```

```package
arcade-overworld=github:riknoll/arcade-overworld
```