namespace overworld {
    class State {
        protected map: tiles.TileMapData[][];
        protected transitionRadius: number;
        protected playerSprite: Sprite;
        protected transitionsEnabled: boolean;
        protected column: number;
        protected row: number;
        protected enabled: boolean;
        protected wallsBlockTransitions: boolean;
        protected continuousMode: boolean;
        protected continuousData: overworld.TileMapData;
        protected mapLoadedHandlers: ((col: number, row: number, map: tiles.TileMapData) => void)[]

        transitionDuration: number;
        transitionFunc: TimingFunction;
        transitionType: AnimationType;

        protected customColor: number;
        protected isTransitioning: boolean;
        protected nextPlayerLeft: number;
        protected nextPlayerTop: number;
        protected scrollTransitionZIndex: number;

        constructor() {
            this.customColor = 0;
            this.transitionRadius = 4;
            this.column = 0;
            this.row = 0;
            this.wallsBlockTransitions = false;
            this.transitionDuration = 300;
            this.scrollTransitionZIndex = 99;
            this.transitionFunc = TimingFunction.Linear;
            this.transitionType = AnimationType.None;
            this.mapLoadedHandlers = [];

            game.eventContext().registerFrameHandler(scene.UPDATE_PRIORITY - 1, () => {
                this.update();
            })
        }

        setMap(map: tiles.TileMapData[][]) {
            this.map = map;
            if (this.continuousMode) {
                this.initContinuousTilemap();
            }
            else if (this.enabled === undefined) {
                this.enabled = !!map;
            }
        }

        setPlayerSprite(sprite: Sprite) {
            this.playerSprite = sprite;
        }

        loadMap(column: number, row: number, transitionDirection?: CollisionDirection): boolean {
            if (this.continuousMode) {
                this.setContinuousModeEnabled(false);
            }

            const newMap = this.getMap(column, row);
            if (!newMap) return false;

            const doTransition = () => {
                this.column = column;
                this.row = row;

                let didTransition = false;
                if (transitionDirection !== undefined) {
                    if (this.transitionType === AnimationType.Scroll) {
                        this.startScrollTransition(transitionDirection, newMap);
                        didTransition = true;
                    }
                    else if (this.transitionType === AnimationType.FadeToWhite) {
                        this.startColorTransition(newMap, 255, 255, 255);
                        didTransition = true;
                    }
                    else if (this.transitionType === AnimationType.FadeToBlack) {
                        this.startColorTransition(newMap, 0, 0, 0);
                        didTransition = true;
                    }
                    else if (this.transitionType === AnimationType.FadeToColor) {
                        this.startColorTransition(
                            newMap,
                            (this.customColor >> 16) & 0xff,
                            (this.customColor >> 8) & 0xff,
                            this.customColor & 0xff
                        )
                        didTransition = true;
                    }
                }

                if (!didTransition) {
                    tiles.setTilemap(newMap);
                    if (this.playerSprite) {
                        this.playerSprite.left = this.nextPlayerLeft;
                        this.playerSprite.top = this.nextPlayerTop;
                    }
                    this.fireMapLoadEvent();
                }
            }

            if (this.playerSprite) {
                this.nextPlayerLeft = this.playerSprite.left;
                this.nextPlayerTop = this.playerSprite.top;
            }

            if (transitionDirection === undefined || !this.playerSprite) {
                doTransition();
                return true;
            }

            const tileWidth = 1 << newMap.scale;

            const playerWidth = Fx.toInt(this.playerSprite._hitbox.width);
            const playerHeight = Fx.toInt(this.playerSprite._hitbox.height);
            const mapWidth = newMap.width << newMap.scale;
            const mapHeight = newMap.height << newMap.scale;
            if (transitionDirection == CollisionDirection.Top) {
                if (canSpriteFit(
                    newMap,
                    this.playerSprite.left,
                    (newMap.height << newMap.scale) - playerHeight - 1,
                    playerWidth,
                    playerHeight
                )) {
                    this.nextPlayerTop = (newMap.height << newMap.scale) - playerHeight - 1;
                    doTransition();
                    return true;
                }
            }
            else if (transitionDirection == CollisionDirection.Bottom) {
                if (canSpriteFit(
                    newMap,
                    this.playerSprite.left,
                    0,
                    playerWidth,
                    playerHeight
                )) {
                    this.nextPlayerTop = 0;
                    doTransition();
                    return true;
                }
            }
            else if (transitionDirection == CollisionDirection.Left) {
                if (canSpriteFit(
                    newMap,
                    (newMap.width << newMap.scale) - playerWidth - 1,
                    this.playerSprite.top,
                    playerWidth,
                    playerHeight
                )) {
                    this.nextPlayerLeft = (newMap.width << newMap.scale) - playerWidth - 1;
                    doTransition();
                    return true;
                }
            }
            else {
                if (canSpriteFit(
                    newMap,
                    0,
                    this.playerSprite.top,
                    playerWidth,
                    playerHeight
                )) {
                    this.nextPlayerLeft = 0;
                    doTransition();
                    return true;
                }
            }

            if (this.wallsBlockTransitions) {
                return false;
            }


            // when moving the player to the opposite edge of the next tilemap,
            // try to find the closest tile that isn't obstructed by walls
            if (transitionDirection == CollisionDirection.Top) {
                for (let row = newMap.height - (playerHeight >> newMap.scale) - 1; row >= 0; row--) {
                    let x0 = (this.playerSprite.left >> newMap.scale) << newMap.scale;
                    let x1 = ((this.playerSprite.left >> newMap.scale) + 1) << newMap.scale;

                    while (x0 >= 0 || x1 < mapWidth - playerWidth) {
                        if (x0 >= 0) {
                            if (canSpriteFit(
                                newMap,
                                x0,
                                row << newMap.scale,
                                playerWidth,
                                playerHeight
                            )) {
                                this.nextPlayerLeft = x0;
                                this.nextPlayerTop = ((row + 1) << newMap.scale) - playerHeight;
                                doTransition();
                                return true;
                            }
                            x0 -= tileWidth;
                        }

                        if (x1 < mapWidth - playerWidth) {
                            if (canSpriteFit(
                                newMap,
                                x1,
                                row << newMap.scale,
                                playerWidth,
                                playerHeight
                            )) {
                                this.nextPlayerLeft = x1;
                                this.nextPlayerTop = ((row + 1) << newMap.scale) - playerHeight;
                                doTransition();
                                return true;
                            }
                            x1 += tileWidth;
                        }
                    }
                }

                this.nextPlayerTop = (newMap.height << newMap.scale) - playerHeight - 1;
            }
            else if (transitionDirection == CollisionDirection.Bottom) {
                for (let row = 0; row < newMap.height - (playerHeight >> newMap.scale); row++) {
                    let x0 = (this.playerSprite.left >> newMap.scale) << newMap.scale;
                    let x1 = ((this.playerSprite.left >> newMap.scale) + 1) << newMap.scale;

                    while (x0 >= 0 || x1 < mapWidth - playerWidth) {
                        if (x0 >= 0) {
                            if (canSpriteFit(
                                newMap,
                                x0,
                                row << newMap.scale,
                                playerWidth,
                                playerHeight
                            )) {
                                this.nextPlayerLeft = x0;
                                this.nextPlayerTop = row << newMap.scale;
                                doTransition();
                                return true;
                            }
                            x0 -= tileWidth;
                        }

                        if (x1 < mapWidth - playerWidth) {
                            if (canSpriteFit(
                                newMap,
                                x1,
                                row << newMap.scale,
                                playerWidth,
                                playerHeight
                            )) {
                                this.nextPlayerLeft = x1;
                                this.nextPlayerTop = row << newMap.scale;
                                doTransition();
                                return true;
                            }
                            x1 += tileWidth;
                        }
                    }
                }

                this.nextPlayerTop = 0;
            }
            else if (transitionDirection == CollisionDirection.Left) {
                for (let col = newMap.width - (playerWidth >> newMap.scale) - 1; col >= 0; col--) {
                    let y0 = (this.playerSprite.top >> newMap.scale) << newMap.scale;
                    let y1 = ((this.playerSprite.top >> newMap.scale) + 1) << newMap.scale;

                    while (y0 >= 0 || y1 < mapHeight - playerHeight) {
                        if (y0 >= 0) {
                            if (canSpriteFit(
                                newMap,
                                col << newMap.scale,
                                y0,
                                playerWidth,
                                playerHeight
                            )) {
                                this.nextPlayerTop = y0;
                                this.nextPlayerLeft = ((col + 1) << newMap.scale) - playerWidth;
                                doTransition();
                                return true;
                            }
                            y0 -= tileWidth;
                        }

                        if (y1 < mapHeight - playerHeight) {
                            if (canSpriteFit(
                                newMap,
                                col << newMap.scale,
                                y1,
                                playerWidth,
                                playerHeight
                            )) {
                                this.nextPlayerTop = y1;
                                this.nextPlayerLeft = ((col + 1) << newMap.scale) - playerWidth;
                                doTransition();
                                return true;
                            }
                            y1 += tileWidth;
                        }
                    }
                }

                this.nextPlayerLeft = (newMap.width << newMap.scale) - playerWidth - 1;
            }
            else {
                for (let col = 0; col < newMap.width - (playerWidth >> newMap.scale) - 1; col++) {
                    let y0 = (this.playerSprite.top >> newMap.scale) << newMap.scale;
                    let y1 = ((this.playerSprite.top >> newMap.scale) + 1) << newMap.scale;

                    while (y0 >= 0 || y1 < mapHeight - playerHeight) {
                        if (y0 >= 0) {
                            if (canSpriteFit(
                                newMap,
                                col << newMap.scale,
                                y0,
                                playerWidth,
                                playerHeight
                            )) {
                                this.nextPlayerLeft = y0;
                                this.nextPlayerTop = col << newMap.scale;
                                doTransition();
                                return true;
                            }
                            y0 -= tileWidth;
                        }

                        if (y1 < mapHeight - playerHeight) {
                            if (canSpriteFit(
                                newMap,
                                col << newMap.scale,
                                y1,
                                playerWidth,
                                playerHeight
                            )) {
                                this.nextPlayerTop = y1;
                                this.nextPlayerLeft = col << newMap.scale;
                                doTransition();
                                return true;
                            }
                            y1 += tileWidth;
                        }
                    }
                }

                this.nextPlayerLeft = 0;
            }

            doTransition();
            return true;
        }

        update() {
            if (!this.playerSprite) return;

            if (this.continuousMode) {
                this.updateContinuousMode();
            }
            else {
                this.updateMapTransitions();
            }
        }

        protected updateContinuousMode() {
            const column = this.playerSprite.x >> this.continuousData.scale;
            const row = this.playerSprite.y >> this.continuousData.scale;

            const overworldColumn = Math.idiv(column, this.continuousData.mapWidth);
            const overworldRow = Math.idiv(row, this.continuousData.mapHeight);

            if (
                (this.column !== overworldColumn || this.row !== overworldRow) &&
                this.getMap(overworldColumn, overworldRow)
            ) {
                this.column = overworldColumn;
                this.row = overworldRow;
                this.fireMapLoadEvent();
            }
        }

        protected updateMapTransitions() {
            if (!this.enabled || this.isTransitioning) return;

            const map = this.getMap(this.column, this.row);

            const mapWidth = map.width << map.scale;
            const mapHeight = map.height << map.scale;

            let movingLeft = this.playerSprite.vx < 0;
            let movingRight = this.playerSprite.vx > 0;
            let movingUp = this.playerSprite.vy < 0;
            let movingDown = this.playerSprite.vy > 0;

            // if the player is up against the edge of the tilemap, they
            // won't have velocity in the direction of the edge even if the
            // player is holding that directional button. so, we explicitly
            // see if this player is being controlled by a player and see if
            // the corresponding button is pressed
            const controlledSprites = game.currentScene().controlledSprites;
            for (let i = 0; i < controlledSprites.length; i++) {
                if (!controlledSprites[i]) continue;

                for (const sprite of controlledSprites[i]) {
                    if (sprite.s !== this.playerSprite) continue;

                    const ctrl = controller.players().find(c => c.playerIndex === i)

                    if (!ctrl) continue;

                    if (sprite.vx) {
                        if (ctrl.right.isPressed() && !ctrl.left.isPressed()) {
                            movingRight = movingRight || sprite.vx > 0;
                            movingLeft = movingLeft || sprite.vx < 0;
                        }
                        else if (ctrl.left.isPressed() && !ctrl.right.isPressed()) {
                            movingRight = movingRight || sprite.vx < 0;
                            movingLeft = movingLeft || sprite.vx > 0;
                        }
                    }

                    if (sprite.vy) {
                        if (ctrl.down.isPressed() && !ctrl.up.isPressed()) {
                            movingDown = movingDown || sprite.vy > 0;
                            movingUp = movingUp || sprite.vy < 0;
                        }
                        else if (ctrl.up.isPressed() && !ctrl.down.isPressed()) {
                            movingDown = movingDown || sprite.vy < 0;
                            movingUp = movingUp || sprite.vy > 0;
                        }
                    }
                }
            }

            if (movingUp && this.playerSprite.top < this.transitionRadius) {
                if (this.loadMap(this.column, this.row - 1, CollisionDirection.Top)) {
                    return;
                }
            }
            if (movingRight && this.playerSprite.right > mapWidth - this.transitionRadius) {
                if (this.loadMap(this.column + 1, this.row, CollisionDirection.Right)) {
                    return;
                }
            }
            if (movingDown && this.playerSprite.bottom > mapHeight - this.transitionRadius) {
                if (this.loadMap(this.column, this.row + 1, CollisionDirection.Bottom)) {
                    return;
                }
            }
            if (movingLeft && this.playerSprite.left < this.transitionRadius) {
                if (this.loadMap(this.column - 1, this.row, CollisionDirection.Left)) {
                    return;
                }
            }
        }

        currentLocation(prop: LocationProperty) {
            if (prop === LocationProperty.Column) {
                return this.column;
            }
            return this.row;
        }

        getMap(column: number, row: number): tiles.TileMapData {
            row |= 0;
            column |= 0;

            if (row < 0 || column < 0 || row >= this.map.length) {
                return undefined;
            }

            const mapRow = this.map[row];

            if (column >= mapRow.length) {
                return undefined;
            }

            return mapRow[column];
        }

        setMapTransitionRadius(radius: number) {
            this.transitionRadius = Math.max(radius, 1);
        }

        setMapTransitionsEnabled(enabled: boolean) {
            this.enabled = enabled;
        }

        setWallsBlockTransitions(blockEnabled: boolean) {
            this.wallsBlockTransitions = blockEnabled;
        }

        setFadeColor(color: string) {
            this.customColor = parseColor(color);
        }

        setContinuousModeEnabled(enabled: boolean) {
            if (!!this.continuousMode === !!enabled) return;

            this.continuousMode = enabled;
            this.continuousData = undefined;
            if (enabled) {
                this.initContinuousTilemap();
            }
            else {
                const oldTilemap = game.currentScene().tileMap;
                if (oldTilemap) {
                    oldTilemap.renderable.destroy();
                }
                game.currentScene().tileMap = new tiles.TileMap();
                this.column = 0;
                this.row = 0;
            }
        }

        addMapLoadedListener(handler: (column: number, row: number, map: tiles.TileMapData) => void) {
            this.mapLoadedHandlers.push(handler);
        }

        removeMapLoadedListener(handler: (column: number, row: number, map: tiles.TileMapData) => void) {
            this.mapLoadedHandlers = this.mapLoadedHandlers.filter(h => h !== handler);
        }

        setScrollAnimationZIndex(z: number) {
            this.scrollTransitionZIndex = z;
        }

        protected initContinuousTilemap() {
            if (!this.map) return;

            const oldTilemap = game.currentScene().tileMap;
            if (oldTilemap) {
                oldTilemap.renderable.destroy();
            }

            const newTilemap = new overworld.TileMap();
            game.currentScene().tileMap = newTilemap;
            this.continuousData = new overworld.TileMapData(this.map);
            tiles.setTilemap(this.continuousData);

            let column: number;
            let row: number;

            if (this.playerSprite) {
                column = this.playerSprite.x >> this.continuousData.scale;
                row = this.playerSprite.y >> this.continuousData.scale;
            }
            else {
                const camera = game.currentScene().camera;

                column = camera.x >> this.continuousData.scale;
                row = camera.y >> this.continuousData.scale;
            }

            this.column = Math.idiv(column, this.continuousData.mapWidth);
            this.row = Math.idiv(row, this.continuousData.mapHeight);

            if (!this.getMap(this.column, this.row)) {
                this.column = 0;
                this.row = 0;
            }

            this.fireMapLoadEvent();
        }

        protected startScrollTransition(direction: CollisionDirection, newMap: tiles.TileMapData) {
            this.isTransitioning = true;
            const playerIsInvisible = this.playerSprite.flags & SpriteFlag.Invisible;

            const playerScreenLeft = this.playerSprite.left - game.currentScene().camera.drawOffsetX;
            const playerScreenTop = this.playerSprite.top - game.currentScene().camera.drawOffsetY;

            this.playerSprite.setFlag(SpriteFlag.Invisible, true);
            const savedScreen = image.create(screen.width, screen.height);
            const recorder = scene.createRenderable(this.scrollTransitionZIndex, (target, camera) => {
                savedScreen.drawImage(screen, 0, 0);
            });

            game.currentScene().render();

            recorder.destroy();

            if (!playerIsInvisible) {
                this.playerSprite.setFlag(SpriteFlag.Invisible, false);
            }

            let callback: control.FrameCallback;

            const loadNewMap = () => {
                if (!playerIsInvisible) {
                    this.playerSprite.setFlag(SpriteFlag.Invisible, true);
                }
                this.playerSprite.left = this.nextPlayerLeft;
                this.playerSprite.top = this.nextPlayerTop;

                tiles.setTilemap(newMap);
                this.fireMapLoadEvent();

                game.eventContext().unregisterFrameHandler(callback);
                const startTime = control.millis();
                const renderer = scene.createRenderable(this.scrollTransitionZIndex, () => {
                    let progress = Math.min(1, (control.millis() - startTime) / this.transitionDuration);

                    progress = timingFunction(progress, this.transitionFunc);
                    if (direction === CollisionDirection.Right) {
                        const offset = Math.round(progress * screen.width);
                        screen.scroll(screen.width - offset, 0);
                        screen.drawImage(savedScreen, -offset, 0);
                    }
                    else if (direction === CollisionDirection.Left) {
                        const offset = Math.round(progress * screen.width);
                        screen.scroll(-(screen.width - offset), 0);
                        screen.drawImage(savedScreen, offset, 0);
                    }
                    else if (direction === CollisionDirection.Top) {
                        const offset = Math.round(progress * screen.height);
                        screen.scroll(0, -(screen.height - offset));
                        screen.drawImage(savedScreen, 0, offset);
                    }
                    else {
                        const offset = Math.round(progress * screen.height);
                        screen.scroll(0, screen.height - offset);
                        screen.drawImage(savedScreen, 0, -offset);
                    }

                    if (!playerIsInvisible) {
                        const playerDestinationLeft = this.playerSprite.left - game.currentScene().camera.drawOffsetX;
                        const playerDestinationTop = this.playerSprite.top - game.currentScene().camera.drawOffsetY;

                        const left = playerScreenLeft + (playerDestinationLeft - playerScreenLeft) * progress;
                        const top = playerScreenTop + (playerDestinationTop - playerScreenTop) * progress;
                        screen.drawTransparentImage(this.playerSprite.image, left, top);
                    }
                });

                const previousScene = game.currentScene();
                game.pushScene();

                scene.createRenderable(1, () => {
                    const currentMap = game.currentScene().tileMap;
                    const currentCamera = game.currentScene().camera;

                    // if any render functions in the user project try to get the tilemap,
                    // they do so by getting it off of the current scene. override the scene's
                    // tilemap so that they get the map they're expecting
                    game.currentScene().tileMap = previousScene.tileMap;
                    game.currentScene().camera = previousScene.camera;
                    game.currentScene().camera.update();

                    previousScene.render();

                    game.currentScene().tileMap = currentMap;
                    game.currentScene().camera = currentCamera;

                    if (control.millis() - startTime >= this.transitionDuration) {
                        this.isTransitioning = false;
                        game.popScene();
                        renderer.destroy();
                        if (!playerIsInvisible) {
                            this.playerSprite.setFlag(SpriteFlag.Invisible, false);
                        }
                    }
                })
            };

            callback = game.eventContext().registerFrameHandler(-1, loadNewMap);
        }

        protected startColorTransition(newMap: tiles.TileMapData, r: number, g: number, b: number) {
            this.isTransitioning = true;
            const previousScene = game.currentScene();
            game.pushScene();

            const startTime = control.millis();

            const originalPalette = hex`__palette`;

            scene.createRenderable(1, () => {
                let progress = Math.min(1, (control.millis() - startTime) / this.transitionDuration);
                progress = timingFunction(progress, this.transitionFunc);

                if (progress > 0.5) {
                    game.popScene();
                    tiles.setTilemap(newMap);
                    if (this.playerSprite) {
                        this.playerSprite.left = this.nextPlayerLeft;
                        this.playerSprite.top = this.nextPlayerTop;
                    }
                    this.fireMapLoadEvent();

                    game.pushScene();

                    scene.createRenderable(1, () => {
                        let progress = Math.min(1, (control.millis() - startTime) / this.transitionDuration);
                        progress = timingFunction(progress, this.transitionFunc);

                        image.setPalette(fadePaletteFromColor(
                            originalPalette,
                            r,
                            g,
                            b,
                            (progress - 0.5) * 2
                        ))
                        previousScene.render();

                        if (progress === 1) {
                            game.popScene();
                            this.isTransitioning = false;
                        }
                    })
                }
                else {
                    image.setPalette(fadePaletteToColor(
                        originalPalette,
                        r,

                        g,
                        b,
                        progress * 2
                    ))
                    previousScene.render();
                }
            })
        }

        protected fireMapLoadEvent() {
            for (const handler of this.mapLoadedHandlers) {
                handler(this.column, this.row, this.getMap(this.column, this.row));
            }
        }
    }

    function createState() {
        return new State();
    }

    export function _state(): State {
        return __util.getState(createState);
    }

    function canSpriteFit(
        map: tiles.TileMapData,
        left: number,
        top: number,
        width: number,
        height: number
    ) {
        const x0 = left >> map.scale;
        const y0 = top >> map.scale;
        const x1 = (left + width - 1) >> map.scale;
        const y1 = (top + height - 1) >> map.scale;

        for (let x = x0; x <= x1; x++) {
            for (let y = y0; y <= y1; y++) {
                if (map.isWall(x, y)) {
                    return false;
                }
            }
        }

        return true;
    }

    function timingFunction(x: number, func: TimingFunction) {
        // equations from https://easings.net/
        switch (func) {
            case TimingFunction.Linear:
                return x;
            case TimingFunction.EaseIn:
                return x * x * x;
            case TimingFunction.EaseOut:
                return 1 - Math.pow(1 - x, 3);
            case TimingFunction.EaseInOut:
                return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
            case TimingFunction.EaseInExponential:
                return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
            case TimingFunction.EaseOutExponential:
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            case TimingFunction.EaseInOutExponential:
                return x === 0
                    ? 0
                    : x === 1
                        ? 1
                        : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
                            : (2 - Math.pow(2, -20 * x + 10)) / 2;
        }
    }

    function fadePaletteToColor(palette: Buffer, r: number, g: number, b: number, progress: number) {
        const result = palette.slice();
        for (let i = 0; i < palette.length; i += 3) {
            result[i] += (r - palette[i]) * progress;
            result[i + 1] += (g - palette[i + 1]) * progress;
            result[i + 2] += (b - palette[i + 2]) * progress;
        }
        return result;
    }

    function fadePaletteFromColor(palette: Buffer, r: number, g: number, b: number, progress: number) {
        const result = palette.slice();
        for (let i = 0; i < palette.length; i += 3) {
            result[i] = r + (palette[i] - r) * progress;
            result[i + 1] = g + (palette[i + 1] - g) * progress;
            result[i + 2] = b + (palette[i + 2] - b) * progress;
        }
        return result;
    }

    function parseColor(color: string) {
        let r = 0;
        let g = 0;
        let b = 0;

        if (color.length === 3) {
            r = parseInt(color.charAt(0), 16);
            g = parseInt(color.charAt(1), 16);
            b = parseInt(color.charAt(2), 16);
        }
        else if (color.length === 4) {
            r = parseInt(color.charAt(1), 16);
            g = parseInt(color.charAt(2), 16);
            b = parseInt(color.charAt(3), 16);
        }
        else if (color.length === 6) {
            r = parseInt(color.slice(0, 2), 16);
            g = parseInt(color.slice(2, 4), 16);
            b = parseInt(color.slice(4), 16);
        }
        else if (color.length === 7) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5), 16);
        }
        else if (color.length === 8) {
            r = parseInt(color.slice(2, 4), 16);
            g = parseInt(color.slice(4, 6), 16);
            b = parseInt(color.slice(6), 16);
        }

        const colorNum = (r << 16) | (g << 8) | b;

        if (Number.isNaN(colorNum)) {
            return 0;
        }

        return colorNum;
    }

    function dumpImage(image: Image) {
        let result = "img`\n";
        const hexChars = "0123456789ABCDEF";
        for (let y = 0; y < image.height; y++) {
            let row = "    ";
            for (let x = 0; x < image.width; x++) {
                row += hexChars.charAt(image.getPixel(x, y));;
                if (x < image.width - 1) {
                    row += " ";
                }
                else {
                    row += "\n";
                }
            }
            result += row;
        }
        result += "`";
        console.log(result);
    }
}