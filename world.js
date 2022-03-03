class World 
{
    constructor(tiles, source, enemy, daysTillRain) {
        this.tiles = tiles;
        this.source = source;
        this.enemy = enemy;
        this.daysTillRain = daysTillRain;
    }
}

module.exports = World;