import { Card } from './card.mjs';
import { tileOwner } from './tile.mjs'

class Player {
  constructor(world, jsonObj) {
    this.world = world;
    this.points = jsonObj.points;
    this.gold = jsonObj.gold;
    this.fertilizerActive = jsonObj.fertilizerActive;

    this.tiles = [];

    for (let i = 0; i < jsonObj.tiles.length; i++) {
      let tile = this.world.getTile(jsonObj.tiles[i].x, jsonObj.tiles[i].y);
      tile.owner = tileOwner.local;
      this.tiles.push(tile);
    }

    // stvori kartice
    this.cards = [];
    for (let i = 0; i < jsonObj.cards.length; i++)
      this.cards.push(new Card(jsonObj.cards[i]));
  }

  update(jsonObj, tileOwner) {
    // ovo uvek update
    this.points = jsonObj.points;
    this.gold = jsonObj.gold;
    this.fertilizerActive = jsonObj.fertilizerActive;
    this.tiles = [];

    // updatovati vlasnistvo svakog tilea
    for (let tile in jsonObj.tiles) {
      let wTile = this.world.getTile(jsonObj.tiles[tile].x, jsonObj.tiles[tile].y);
      wTile.owner = tileOwner;
      this.tiles.push(wTile);
    }

    // ocisti sve kartice i ubaci nove
    this.cards = [];
    for (let i = 0; i < jsonObj.cards.length; i++)
      this.cards.push(new Card(jsonObj.cards[i]));
  }

  getAllNearbyTiles() {
    const closeTiles = [];
    for (let i = 0; i < this.tiles.length; i++) {
      const nearbyTiles = this.world.getTilesNearby(this.tiles[i]);
      for (let j = 0; j < closeTiles.length; j++)
        if (!closeTiles.includes(nearbyTiles[j]))
          closeTiles.push(nearbyTiles[j]);
    }
    return closeTiles;
  }

  getCard(cardId)
  {
    for(let i in this.cards)
      if(this.cards[i].cardId == cardId)
        return this.cards[i];
    return null;
  }
}

export { Player };