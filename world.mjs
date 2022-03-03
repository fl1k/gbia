import { Player } from './player.mjs';
import { Tile } from './tile.mjs';

const WORLD_BORDER = 7;

function isValidPosition(pos)
{
    return !(pos.x < 0 || pos.x > WORLD_BORDER || pos.y < 0 || pos.y > WORLD_BORDER);
}

class World {
    constructor(jsonObj) {
        this.tiles = [];
        for (let tile in jsonObj.tiles)
            this.tiles.push(new Tile(tile));
        this.source = new Player(jsonObj.source);
        this.enemy = new Player(jsonObj.enemy);
        this.daysTillRain = jsonObj.daysTillRain;
    }

    getTile(x, y)
    {
        return this.tiles[x*8 + y];
    }

    // speed
    getNeighboringTiles()
    {
        const tiles = [];
        let pos1 = {x: this.x - 1, y: this.y};
        let pos2 = {x: this.x - 1, y: this.y + 1};
        let pos3 = {x: this.x - 1, y: this.y - 1};

        let pos4 = {x: this.x + 1, y: this.y};
        let pos5 = {x: this.x + 1, y: this.y + 1};
        let pos6 = {x: this.x + 1, y: this.y - 1};

        let pos7 = {x: this.x, y: this.y + 1};
        let pos8 = {x: this.x, y: this.y - 1};
        if(isValidPosition(pos1))
            this.tiles.push(this.getTile(pos1.x, pos1.y));
        if(isValidPosition(pos2))
            this.tiles.push(this.getTile(pos2.x, pos2.y));
        if(isValidPosition(pos3))
            this.tiles.push(this.getTile(pos3.x, pos3.y));
        if(isValidPosition(pos4))
            this.tiles.push(this.getTile(pos4.x, pos4.y));        
        if(isValidPosition(pos5))
            this.tiles.push(this.getTile(pos5.x, pos5.y));
        if(isValidPosition(pos6))
            this.tiles.push(this.getTile(pos6.x, pos6.y));
        if(isValidPosition(pos7))
            this.tiles.push(this.getTile(pos7.x, pos7.y));
        if(isValidPosition(pos8))
            this.tiles.push(this.getTile(pos8.x, pos8.y));

        return tiles;
    }
}

export { World };