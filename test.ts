overworld.setOverworld16(overworld.createMap16(
overworld.mapRow16(overworld.tilemap16(tilemap`level2`), overworld.tilemap16(tilemap`level4`), overworld.tilemap16(tilemap`level6`)),
overworld.mapRow16(overworld.tilemap16(tilemap`level2`), overworld.tilemap16(tilemap`level4`), overworld.tilemap16(tilemap`level6`)),
overworld.mapRow16(overworld.tilemap16(tilemap`level2`), overworld.tilemap16(tilemap`level4`), overworld.tilemap16(tilemap`level6`))
))
let mySprite = sprites.create(img`
    . . . . . . . . . . b 5 b . . .
    . . . . . . . . . b 5 b . . . .
    . . . . . . b b b b b b . . . .
    . . . . . b b 5 5 5 5 5 b . . .
    . . . . b b 5 d 1 f 5 5 d f . .
    . . . . b 5 5 1 f f 5 d 4 c . .
    . . . . b 5 5 d f b d d 4 4 . .
    . b b b d 5 5 5 5 5 4 4 4 4 4 b
    b d d d b b d 5 5 4 4 4 4 4 b .
    b b d 5 5 5 b 5 5 5 5 5 5 b . .
    c d c 5 5 5 5 d 5 5 5 5 5 5 b .
    c b d c d 5 5 b 5 5 5 5 5 5 b .
    . c d d c c b d 5 5 5 5 5 d b .
    . . c b d d d d d 5 5 5 b b . .
    . . . c c c c c c c c b b . . .
    . . . . . . . . . . . . . . . .
    `, SpriteKind.Player)
controller.moveSprite(mySprite)
overworld.setPlayerSprite(mySprite)
scene.cameraFollowSprite(mySprite)
overworld.loadMap(0, 0)
let mySprite2 = sprites.create(img`
    . . 2 2 b b b b b . . . . . . .
    . 2 b 4 4 4 4 4 4 b . . . . . .
    2 2 4 4 4 4 d d 4 4 b . . . . .
    2 b 4 4 4 4 4 4 d 4 b . . . . .
    2 b 4 4 4 4 4 4 4 d 4 b . . . .
    2 b 4 4 4 4 4 4 4 4 4 b . . . .
    2 b 4 4 4 4 4 4 4 4 4 e . . . .
    2 2 b 4 4 4 4 4 4 4 b e . . . .
    . 2 b b b 4 4 4 b b b e . . . .
    . . e b b b b b b b e e . . . .
    . . . e e b 4 4 b e e e b . . .
    . . . . . e e e e e e b d b b .
    . . . . . . . . . . . b 1 1 1 b
    . . . . . . . . . . . c 1 d d b
    . . . . . . . . . . . c 1 b c .
    . . . . . . . . . . . . c c . .
    `, SpriteKind.Player)
mySprite2.z = 200
overworld.setAnimationType(overworld.AnimationType.Scroll)
