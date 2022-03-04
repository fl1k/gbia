import { Plant } from './plant.mjs';
import { Player } from './player.mjs';
import { Tile } from './tile.mjs';
import {tileOwner} from './tile.mjs'

const WORLD_BORDER = 7;
const WORLD_SIZE = 64;

function isValidPosition(pos) {
    return !(pos.x < 0 || pos.x > WORLD_BORDER || pos.y < 0 || pos.y > WORLD_BORDER);
}

class World {
    constructor(jsonObj) {
        this.tiles = [];
        for (let tile in jsonObj.tiles)
            this.tiles.push(new Tile(world, tile));
        this.source = new Player(world, jsonObj.source);
        this.enemy = new Player(world, jsonObj.enemy);
        this.daysTillRain = jsonObj.daysTillRain;
    }

    getTile(x, y) {
        return this.tiles[x * 8 + y];
    }

    // Zvano da sinhronizuje trenutni svet sa novim stvarima.
    update(jsonObj)
    {
        // ovo na svakom updateu
        this.daysTillRain = jsonObj.daysTillRain;
        for(let i = 0; i < WORLD_SIZE; i++)
            this.tiles[i].owner = tileOwner.none;

        // sad proveravamo plantove
        for(let i = 0; i < WORLD_SIZE; i++)
            this.tiles[i].update(jsonObj.tiles[i]);

        // sad updatujemo igrace
        this.source.update(jsonObj.source, tileOwner.local);
        this.enemy.update(jsonObj.enemy, tileOwner.enemy);
    }
    // speed
    getTilesNearby(tile) {
        const tiles = [];
        let pos1 = { x: tile.x - 1, y: tile.y };
        let pos2 = { x: tile.x - 1, y: tile.y + 1 };
        let pos3 = { x: tile.x - 1, y: tile.y - 1 };

        let pos4 = { x: tile.x + 1, y: tile.y };
        let pos5 = { x: tile.x + 1, y: tile.y + 1 };
        let pos6 = { x: tile.x + 1, y: tile.y - 1 };

        let pos7 = { x: tile.x, y: tile.y + 1 };
        let pos8 = { x: tile.x, y: tile.y - 1 };

        if (isValidPosition(pos1))
            this.tiles.push(this.getTile(pos1.x, pos1.y));
        if (isValidPosition(pos2))
            this.tiles.push(this.getTile(pos2.x, pos2.y));
        if (isValidPosition(pos3))
            this.tiles.push(this.getTile(pos3.x, pos3.y));
        if (isValidPosition(pos4))
            this.tiles.push(this.getTile(pos4.x, pos4.y));
        if (isValidPosition(pos5))
            this.tiles.push(this.getTile(pos5.x, pos5.y));
        if (isValidPosition(pos6))
            this.tiles.push(this.getTile(pos6.x, pos6.y));
        if (isValidPosition(pos7))
            this.tiles.push(this.getTile(pos7.x, pos7.y));
        if (isValidPosition(pos8))
            this.tiles.push(this.getTile(pos8.x, pos8.y));

        return tiles;
    }
}

export { World };