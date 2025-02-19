# set scroll animation z index

Sets the z-index at which the scroll animation renders. Any sprites with a higher z-index will be ignored by the scroll. This block only has an effect if the animation is set to scroll. The default value for this is 99, which is one less than the z-index that the HUD from the info category renders at (100).

```sig
overworld.setScrollAnimationZIndex(99)
```

This block does nothing if you are using "continuous mode".

## Parameters

* **z**: The z depth to render the animation at

## Example #example

```blocks
```

```package
arcade-overworld=github:riknoll/arcade-overworld
```