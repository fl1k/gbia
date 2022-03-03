import { Player } from './player.mjs';
import { Tile } from './tile.mjs';

class World {
    constructor(jsonObj) {
        this.tiles = [];
        for (let tile in jsonObj.tiles)
            this.tiles.push(new Tile(tile));
        this.source = new Player(jsonObj.source);
        this.enemy = new Player(jsonObj.enemy);
        this.daysTillRain = jsonObj.daysTillRain;
    }


}

export { World };