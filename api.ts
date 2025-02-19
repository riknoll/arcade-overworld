//% color="#19572b"
//% icon="\uf0ac"
namespace overworld {
    export enum LocationProperty {
        //% block="column"
        Column,
        //% block="row"
        Row
    }

    export enum TimingFunction {
        //% block="linear"
        Linear,
        //% block="ease in cubic"
        EaseIn,
        //% block="ease out cubic"
        EaseOut,
        //% block="ease in out cubic"
        EaseInOut,
        //% block="ease in exponential"
        EaseInExponential,
        //% block="ease out exponential"
        EaseOutExponential,
        //% block="ease in out exponential"
        EaseInOutExponential
    }

    export enum AnimationType {
        //% block="none"
        None,
        //% block="scroll"
        Scroll,
        //% block="fade to white"
        FadeToWhite,
        //% block="fade to black"
        FadeToBlack,
        //% block="fade to custom color"
        FadeToColor
    }

    //% blockId=overworld_setOverworld16
    //% block="set overworld $maps"
    //% maps.shadow=overworld_createMap16
    //% group=Create
    //% weight=100
    //% help=github:arcade-overworld/docs/set-overworld
    export function setOverworld16(maps: tiles.TileMapData[][]): void {
        _state().setMap(maps);
    }

    //% blockId=overworld_setOverworld8
    //% block="set overworld $maps"
    //% maps.shadow=overworld_createMap8
    //% group=Create
    //% weight=90
    //% help=github:arcade-overworld/docs/set-overworld
    export function setOverworld8(maps: tiles.TileMapData[][]): void {
        _state().setMap(maps);
    }

    //% blockId=overworld_setPlayerSprite
    //% block="set player sprite $sprite"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% group=Create
    //% weight=80
    //% help=github:arcade-overworld/docs/set-player-sprite
    export function setPlayerSprite(sprite: Sprite): void {
        _state().setPlayerSprite(sprite);
    }

    //% blockId=overworld_currentLocation
    //% block="overworld location $property"
    //% group=Load
    //% weight=100
    //% help=github:arcade-overworld/docs/current-location
    export function currentLocation(property: LocationProperty): number {
        return _state().currentLocation(property);
    }

    //% blockId=overworld_loadMap
    //% block="load overworld map at col $column row $row"
    //% group=Load
    //% weight=90
    //% blockGap=8
    //% help=github:arcade-overworld/docs/load-map
    export function loadMap(column: number, row: number): void {
        _state().loadMap(column, row);
    }

    //% blockId=overworld_loadMapInDirection
    //% block="load overworld map in direction $direction"
    //% group=Load
    //% weight=80
    //% help=github:arcade-overworld/docs/load-map-in-direction
    export function loadMapInDirection(direction: CollisionDirection): void {
        const column = currentLocation(LocationProperty.Column);
        const row = currentLocation(LocationProperty.Row);

        if (direction === CollisionDirection.Top) {
            loadMap(column, row - 1);
        }
        else if (direction === CollisionDirection.Right) {
            loadMap(column + 1, row);
        }
        else if (direction === CollisionDirection.Bottom) {
            loadMap(column, row + 1);
        }
        else {
            loadMap(column - 1, row);
        }
    }

    //% blockId=overworld_getMapAt
    //% block="get overworld map at col $column row $row"
    //% group=Load
    //% weight=70
    //% blockGap=8
    //% help=github:arcade-overworld/docs/get-map-at
    export function getMapAt(column: number, row: number): tiles.TileMapData {
        return _state().getMap(column, row);
    }

    //% blockId=overworld_getMapInDirection
    //% block="get overworld map in direction $direction"
    //% group=Load
    //% weight=60
    //% help=github:arcade-overworld/docs/get-map-in-direction
    export function getMapInDirection(direction: CollisionDirection): tiles.TileMapData {
        const column = currentLocation(LocationProperty.Column);
        const row = currentLocation(LocationProperty.Row);

        if (direction === CollisionDirection.Top) {
            return getMapAt(column, row - 1);
        }
        else if (direction === CollisionDirection.Right) {
            return getMapAt(column + 1, row);
        }
        else if (direction === CollisionDirection.Bottom) {
            return getMapAt(column, row + 1);
        }
        else {
            return getMapAt(column - 1, row);
        }
    }

    //% blockId=overworld_mapExistsAt
    //% block="overworld map exists at col $column row $row"
    //% group=Load
    //% weight=50
    //% blockGap=8
    //% help=github:arcade-overworld/docs/map-exists-at
    export function mapExistsAt(column: number, row: number): boolean {
        return !!getMapAt(column, row);
    }

    //% blockId=overworld_mapExistsInDirection
    //% block="overworld map exists in direction $direction"
    //% group=Load
    //% weight=40
    //% help=github:arcade-overworld/docs/map-exists-in-direction
    export function mapExistsInDirection(direction: CollisionDirection): boolean {
        return !!getMapInDirection(direction);
    }

    //% blockId=overworld_onMapLoaded
    //% block="on map loaded at $overworldColumn $overworldRow $map"
    //% draggableParameters="reporter"
    //% group=Load
    //% weight=30
    //% help=github:arcade-overworld/docs/on-map-loaded
    export function onMapLoaded(handler: (overworldColumn: number, overworldRow: number, map: tiles.TileMapData) => void) {
        _state().addMapLoadedListener(handler);
    }

    //% blockId=overworld_setAnimationType
    //% block="overworld set animation type $animationType"
    //% group=Animation
    //% weight=100
    //% help=github:arcade-overworld/docs/set-animation-type
    export function setAnimationType(animationType: AnimationType) {
        _state().transitionType = animationType;
    }

    //% blockId=overworld_setAnimationDuration
    //% block="overworld set animation duration $duration"
    //% duration.shadow=timePicker
    //% group=Animation
    //% weight=90
    //% help=github:arcade-overworld/docs/set-animation-duration
    export function setAnimationDuration(duration: number) {
        _state().transitionDuration = duration;
    }

    //% blockId=overworld_setAnimationTimingFunction
    //% block="overworld set animation timing function $func"
    //% group=Animation
    //% weight=80
    //% help=github:arcade-overworld/docs/set-animation-timing-function
    export function setAnimationTimingFunction(func: TimingFunction) {
        _state().transitionFunc = func;
    }

    //% blockId=overworld_setAnimationFadeColor
    //% block="overworld set animation custom fade color $color"
    //% group=Animation
    //% color.defl="#000000"
    //% weight=70
    //% help=github:arcade-overworld/docs/set-animation-fade-color
    export function setAnimationFadeColor(color: string) {
        _state().setFadeColor(color);
    }

    //% blockId=overworld_setScrollAnimationZIndex
    //% block="overworld set scroll animation z $z"
    //% group=Animation
    //% z.defl=99
    //% weight=70
    //% help=github:arcade-overworld/docs/set-scroll-animation-z-index
    export function setScrollAnimationZIndex(z: number) {
        _state().setScrollAnimationZIndex(z);
    }

    //% blockId=overworld_setMapTransitionsEnabled
    //% block="set overworld transitions enabled $enabled"
    //% group=Options
    //% weight=100
    //% blockGap=8
    //% help=github:arcade-overworld/docs/set-map-transitions-enabled
    export function setMapTransitionsEnabled(enabled: boolean) {
        _state().setMapTransitionsEnabled(enabled);
    }

    //% blockId=overworld_setMapTransitionRadius
    //% block="set overworld transition radius $radius"
    //% group=Options
    //% weight=90
    //% blockGap=8
    //% help=github:arcade-overworld/docs/set-map-transition-radius
    export function setMapTransitionRadius(radius: number) {
        _state().setMapTransitionRadius(radius);
    }

    //% blockId=overworld_setWallsBlockTransitions
    //% block="set walls block map transitions $blockEnabled"
    //% group=Options
    //% weight=80
    //% help=github:arcade-overworld/docs/set-walls-block-transitions
    export function setWallsBlockTransitions(blockEnabled: boolean) {
        _state().setWallsBlockTransitions(blockEnabled);
    }

    //% blockId=overworld_setContinuousModeEnabled
    //% block="set continuous mode enabled $enabled"
    //% group=Options
    //% weight=70
    //% help=github:arcade-overworld/docs/set-continuous-mode-enabled
    export function setContinuousModeEnabled(enabled: boolean) {
        _state().setContinuousModeEnabled(enabled);
    }

    //% blockId=overworld_createMap16
    //% block="$row0 $row1 $row2|| $row3 $row4 $row5"
    //% row0.shadow=overworld_mapRow16
    //% row1.shadow=overworld_mapRow16
    //% row2.shadow=overworld_mapRow16
    //% row3.shadow=overworld_mapRow16
    //% row4.shadow=overworld_mapRow16
    //% row5.shadow=overworld_mapRow16
    //% inlineInputMode=external
    //% group=Shadows
    //% blockGap=8
    //% help=github:arcade-overworld/docs/create-map
    export function createMap16(
        row0: tiles.TileMapData[],
        row1: tiles.TileMapData[],
        row2: tiles.TileMapData[],
        row3?: tiles.TileMapData[],
        row4?: tiles.TileMapData[],
        row5?: tiles.TileMapData[],
    ): tiles.TileMapData[][] {
        return createMap(
            row0,
            row1,
            row2,
            row3,
            row4,
            row5
        );
    }

    //% blockId=overworld_createMap8
    //% block="$row0 $row1 $row2|| $row3 $row4 $row5"
    //% row0.shadow=overworld_mapRow8
    //% row1.shadow=overworld_mapRow8
    //% row2.shadow=overworld_mapRow8
    //% row3.shadow=overworld_mapRow8
    //% row4.shadow=overworld_mapRow8
    //% row5.shadow=overworld_mapRow8
    //% inlineInputMode=external
    //% group=Shadows
    //% blockGap=8
    //% help=github:arcade-overworld/docs/create-map
    export function createMap8(
        row0: tiles.TileMapData[],
        row1: tiles.TileMapData[],
        row2: tiles.TileMapData[],
        row3?: tiles.TileMapData[],
        row4?: tiles.TileMapData[],
        row5?: tiles.TileMapData[],
    ): tiles.TileMapData[][] {
        return createMap(
            row0,
            row1,
            row2,
            row3,
            row4,
            row5
        );
    }

    //% blockId=overworld_mapRow16
    //% block="$map0 $map1 $map2|| $map3 $map4 $map5"
    //% map0.shadow=overworld_tilemap16
    //% map1.shadow=overworld_tilemap16
    //% map2.shadow=overworld_tilemap16
    //% map3.shadow=overworld_tilemap16
    //% map4.shadow=overworld_tilemap16
    //% map5.shadow=overworld_tilemap16
    //% inlineInputMode=inline
    //% group=Shadows
    //% blockGap=8
    //% help=github:arcade-overworld/docs/create-map
    export function mapRow16(
        map0: tiles.TileMapData,
        map1: tiles.TileMapData,
        map2: tiles.TileMapData,
        map3?: tiles.TileMapData,
        map4?: tiles.TileMapData,
        map5?: tiles.TileMapData,
    ): tiles.TileMapData[] {
        return createMapRow(
            map0,
            map1,
            map2,
            map3,
            map4,
            map5,
        );
    }

    //% blockId=overworld_mapRow8
    //% block="$map0 $map1 $map2|| $map3 $map4 $map5"
    //% map0.shadow=overworld_tilemap8
    //% map1.shadow=overworld_tilemap8
    //% map2.shadow=overworld_tilemap8
    //% map3.shadow=overworld_tilemap8
    //% map4.shadow=overworld_tilemap8
    //% map5.shadow=overworld_tilemap8
    //% inlineInputMode=inline
    //% group=Shadows
    //% blockGap=8
    //% help=github:arcade-overworld/docs/create-map
    export function mapRow8(
        map0: tiles.TileMapData,
        map1: tiles.TileMapData,
        map2: tiles.TileMapData,
        map3?: tiles.TileMapData,
        map4?: tiles.TileMapData,
        map5?: tiles.TileMapData,
    ): tiles.TileMapData[] {
        return createMapRow(
            map0,
            map1,
            map2,
            map3,
            map4,
            map5,
        );
    }

    function createMapRow(
        map0: tiles.TileMapData,
        map1: tiles.TileMapData,
        map2: tiles.TileMapData,
        map3?: tiles.TileMapData,
        map4?: tiles.TileMapData,
        map5?: tiles.TileMapData,
        map6?: tiles.TileMapData,
        map7?: tiles.TileMapData,
        map8?: tiles.TileMapData,
        map9?: tiles.TileMapData,
        map10?: tiles.TileMapData,
        map11?: tiles.TileMapData,
    ): tiles.TileMapData[] {
        const res = [
            map0,
            map1,
            map2,
            map3,
            map4,
            map5,
            map6,
            map7,
            map8,
            map9,
            map10,
            map11
        ];

        return res.filter(m => !!m);
    }

    function createMap(
        row0: tiles.TileMapData[],
        row1: tiles.TileMapData[],
        row2: tiles.TileMapData[],
        row3?: tiles.TileMapData[],
        row4?: tiles.TileMapData[],
        row5?: tiles.TileMapData[],
        row6?: tiles.TileMapData[],
        row7?: tiles.TileMapData[],
        row8?: tiles.TileMapData[],
        row9?: tiles.TileMapData[],
        row10?: tiles.TileMapData[],
        row11?: tiles.TileMapData[],
    ): tiles.TileMapData[][] {
        const res = [
            row0,
            row1,
            row2,
            row3,
            row4,
            row5,
            row6,
            row7,
            row8,
            row9,
            row10,
            row11
        ];

        return res.filter(m => !!m && m.length > 0);
    }

    //% blockId=overworld_tilemap8
    //% block="8 $tilemap"
    //% tilemap.fieldEditor="tilemap"
    //% tilemap.fieldOptions.decompileArgumentAsString="true"
    //% tilemap.fieldOptions.filter="tile"
    //% tilemap.fieldOptions.taggedTemplate="tilemap"
    //% tilemap.fieldOptions.tileWidth=8
    //% tilemap.fieldOptions.initWidth=20
    //% tilemap.fieldOptions.initHeight=15
    //% group="Tilemaps" weight=49 blockGap=8
    //% duplicateShadowOnDrag
    //% group=Shadows
    //% blockGap=8
    //% help=github:arcade-overworld/docs/create-map
    export function tilemap8(tilemap: tiles.TileMapData): tiles.TileMapData {
        return tilemap;
    }

    //% blockId=overworld_tilemap16
    //% block="16 $tilemap"
    //% tilemap.fieldEditor="tilemap"
    //% tilemap.fieldOptions.decompileArgumentAsString="true"
    //% tilemap.fieldOptions.filter="tile"
    //% tilemap.fieldOptions.taggedTemplate="tilemap"
    //% tilemap.fieldOptions.tileWidth=16
    //% tilemap.fieldOptions.initWidth=10
    //% tilemap.fieldOptions.initHeight=8
    //% group="Tilemaps" weight=49 blockGap=8
    //% duplicateShadowOnDrag
    //% group=Shadows
    //% blockGap=8
    //% help=github:arcade-overworld/docs/create-map
    export function tilemap16(tilemap: tiles.TileMapData): tiles.TileMapData {
        return tilemap;
    }
}