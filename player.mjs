import { Card } from './card.mjs';
import {tileOwner} from './tile.mjs'

class Player 
{
  constructor(world, jsonObj) 
  {
    this.world = world;
    this.points = jsonObj.points;
    this.gold = jsonObj.gold;
    this.fertilizerActive = jsonObj.fertilizerActive;

    this.tiles = [];
    for(let tile in jsonObj.tiles)
    {
      let wTile = this.world.getTile(tile.x, tile.y);
      wTile.owner = tileOwner.local;
      this.tiles.push(wTile);
    }

    // stvori kartice
    this.cards = [];
    for(let i = 0; i < jsonObj.cards.length; i++)
      this.cards.push(new Card(jsonObj.cards[i]));
  }

  update(jsonObj, tileOwner)
  {
    // ovo uvek update
    this.points = jsonObj.points;
    this.gold = jsonObj.gold;
    this.fertilizerActive = jsonObj.fertilizerActive;
    this.tiles.clear();

    // updatovati vlasnistvo svakog tilea
    for(let tile in jsonObj.tiles)
    {
      let wTile = this.world.getTile(tile.x, tile.y);
      wTile.owner = tileOwner;
      this.tiles.push(wTile);
    }
  
    // ocisti sve kartice i ubaci nove
    this.cards.clear();
    for(let i = 0; i < jsonObj.cards.length; i++)
      this.cards.push(new Card(jsonObj.cards[i]));
  }
}

export {Player};