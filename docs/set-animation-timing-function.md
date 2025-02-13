# set animation timing function

Sets the timing function, which controls how the tilemap transition animation progresses once it has started. The default timing function is linear; try changing it to something else and seeing what effect it has! This block only takes effect if you have enabled animations using the "set animation type" function.

```sig
overworld.setAnimationTimingFunction(overworld.TimingFunction.Linear)
```

This block does nothing if you are using "continuous mode".

## Parameters

* **timing function**: The timing function to use with the animation

## Example #example

```blocks
```

```package
arcade-overworld=github:riknoll/arcade-overworld
```