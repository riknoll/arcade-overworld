namespace overworld {
    export class TileMapData extends tiles.TileMapData {
        protected rows: number;
        protected columns: number;
        mapWidth: number;
        mapHeight: number;
        protected extendedTileset: Image[];
        protected tileMapping: Buffer[][];

        constructor(protected maps: tiles.TileMapData[][]) {
            super(control.createBuffer(6), img`.`, [], getScale(maps));

            this.mapWidth = 255;
            this.mapHeight = 255;

            this.rows = maps.length;
            this.columns = 0;

            this.extendedTileset = [];
            this.tileMapping = [];

            for (const row of maps) {
                this.columns = Math.max(this.columns, row.length);
                const rowMapping: Buffer[] = [];
                this.tileMapping.push(rowMapping);

                for (const map of row) {
                    if (map) {
                        this.mapWidth = Math.min(this.mapWidth, map.width);
                        this.mapHeight = Math.min(this.mapHeight, map.height);
                        const ts = map.getTileset();
                        const mapping = control.createBuffer(ts.length)
                        rowMapping.push(mapping);

                        for (let j = 0; j < ts.length; j++) {
                            const mapTile = ts[j];
                            let foundIt = false;
                            for (let i = 0; i < this.extendedTileset.length; i++) {
                                const current = this.extendedTileset[i];

                                if (current.equals(mapTile)) {
                                    mapping[j] = i;
                                    foundIt = true;
                                    break;
                                }
                            }

                            if (!foundIt) {
                                mapping[j] = this.extendedTileset.length;
                                this.extendedTileset.push(mapTile);
                            }
                        }
                    }
                    else {
                        rowMapping.push(undefined);
                    }
                }
            }
        }

        get width(): number {
            return this.mapWidth * this.columns;
        }

        get height(): number {
            return this.mapHeight * this.rows;
        }

        getTile(col: number, row: number) {
            if (this.isOutsideMap(col, row)) return 0;

            const map = this.getMap(col, row);
            if (!map) return 0;

            const overworldCol = Math.idiv(col, this.mapWidth);
            const overworldRow = Math.idiv(row, this.mapHeight);

            const tilesetMapping = this.tileMapping[overworldRow][overworldCol];
            const data = map.getTile(col % this.mapWidth, row % this.mapHeight);

            return tilesetMapping[data];
        }

        setTile(col: number, row: number, tile: number) {
            if (this.isOutsideMap(col, row)) return;

            const map = this.getMap(col, row);
            if (!map) return;

            const overworldCol = Math.idiv(col, this.mapWidth);
            const overworldRow = Math.idiv(row, this.mapHeight);

            const tilesetMapping = this.tileMapping[overworldRow][overworldCol];

            for (let i = 0; i < tilesetMapping.length; i++) {
                if (tilesetMapping[i] === tile) {
                    map.setTile(col % this.mapWidth, row % this.mapHeight, i);
                    return;
                }
            }

            const newMapping = control.createBuffer(tilesetMapping.length + 1);
            newMapping.write(0, tilesetMapping);
            const newIndex = newMapping.length - 1;
            newMapping[newIndex] = tile;

            this.tileMapping[overworldRow][overworldCol] = newMapping;

            map.setTile(col % this.mapWidth, row % this.mapHeight, newIndex);
        }

        getTileset() {
            return this.extendedTileset;
        }

        getTileImage(index: number) {
            const size = 1 << this.scale;
            let cachedImage = this.cachedTileView[index];
            if (!cachedImage) {
                const originalImage = this.extendedTileset[index];

                if (originalImage) {
                    if (originalImage.width <= size && originalImage.height <= size) {
                        cachedImage = originalImage;
                    } else {
                        cachedImage = image.create(size, size);
                        cachedImage.drawImage(originalImage, 0, 0);
                    }
                    this.cachedTileView[index] = cachedImage;
                }
            }
            return cachedImage;
        }

        setWall(col: number, row: number, on: boolean) {
            const map = this.getMap(col, row);
            if (!map) return;

            map.setWall(col % this.mapWidth, row % this.mapHeight, on);
        }

        isWall(col: number, row: number) {
            const map = this.getMap(col, row);
            if (!map) return true;

            return map.isWall(col % this.mapWidth, row % this.mapHeight);
        }

        protected getMap(col: number, row: number) {
            const overworldCol = Math.idiv(col, this.mapWidth);
            const overworldRow = Math.idiv(row, this.mapHeight);

            const mapRow = this.maps[overworldRow];

            if (mapRow) return mapRow[overworldCol];
            return undefined;
        }
    }

    function getScale(maps: tiles.TileMapData[][]) {
        for (const row of maps) {
            for (const map of row) {
                if (map) {
                    return map.scale;
                }
            }
        }

        return TileScale.Sixteen
    }

    export class TileMap extends tiles.TileMap {
        constructor(scale: TileScale = TileScale.Sixteen) {
            super(scale);
        }

        protected isInvalidIndex(index: number): boolean {
            return index < 0 || index > 0xffff;
        }

        protected draw(target: Image, camera: scene.Camera) {
            if (!this.enabled) return;

            // render tile map
            const bitmask = (0x1 << this.scale) - 1;
            const offsetX = camera.drawOffsetX & bitmask;
            const offsetY = camera.drawOffsetY & bitmask;

            const x0 = Math.max(0, camera.drawOffsetX >> this.scale);
            const xn = Math.min(this._map.width, ((camera.drawOffsetX + target.width) >> this.scale) + 1);
            const y0 = Math.max(0, camera.drawOffsetY >> this.scale);
            const yn = Math.min(this._map.height, ((camera.drawOffsetY + target.height) >> this.scale) + 1);

            for (let x = x0; x <= xn; ++x) {
                for (let y = y0; y <= yn; ++y) {
                    const index = this._map.getTile(x, y);
                    const tile = this._map.getTileImage(index);
                    if (tile) {
                        target.drawTransparentImage(
                            tile,
                            ((x - x0) << this.scale) - offsetX,
                            ((y - y0) << this.scale) - offsetY
                        );
                    }
                }
            }

            if (game.debug) {
                // render debug grid overlay
                for (let x = x0; x <= xn; ++x) {
                    const xLine = ((x - x0) << this.scale) - offsetX;
                    if (xLine >= 0 && xLine <= screen.width) {
                        target.drawLine(
                            xLine,
                            0,
                            xLine,
                            target.height,
                            1
                        );
                    }
                }

                for (let y = y0; y <= yn; ++y) {
                    const yLine = ((y - y0) << this.scale) - offsetY;
                    if (yLine >= 0 && yLine <= screen.height) {
                        target.drawLine(
                            0,
                            yLine,
                            target.width,
                            yLine,
                            1
                        );
                    }
                }
            }
        }
    }
}