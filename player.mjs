import { Card } from './card.mjs';
import { tileOwner } from './tile.mjs'


class QItem {

  constructor(x, y, w) {
    this.row = x;
    this.col = y;
    this.dist = w;
  }
};

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
    for (let i in jsonObj.tiles) {
      let tile = this.world.getTile(jsonObj.tiles[i].x, jsonObj.tiles[i].y);
      tile.owner = tileOwner;
      tile.update(jsonObj.tiles[i]);
      this.tiles.push(tile);
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

  // owned!
  getCardCount(cardId) {
    for (let i in this.cards)
      if (this.cards[i].cardId == cardId)
        return this.cards[i].owned;
    return -1;
  }

  getClosest()
  {
    var source = new QItem(0, 0, 0);
  
    // To keep track of visited QItems. Marking
    // blocked cells as visited.
    var visited = Array.from(Array(8), ()=>Array(8).fill(0));
    for (var i = 0; i < 8; i++) 
    {
        for (var j = 0; j < 8; j++)
        {
            let index = i * 8 + j;
            if (grid[index])
                visited[i][j] = true;
            else
                visited[i][j] = false;
        }
    }
  
    // applying BFS on matrix cells starting from source
    var q = [];
    q.push(source);
    visited[source.row][source.col] = true;
    while (q.length!=0) {
        var p = q[0];
        q.shift();
  
        // Destination found;
        if (grid[p.row][p.col] == 'd')
            return p.dist;
  
        // moving up
        if (p.row - 1 >= 0 &&
            visited[p.row - 1][p.col] == false) {
            q.push(new QItem(p.row - 1, p.col, p.dist + 1));
            visited[p.row - 1][p.col] = true;
        }
  
        // moving down
        if (p.row + 1 < N &&
            visited[p.row + 1][p.col] == false) {
            q.push(new QItem(p.row + 1, p.col, p.dist + 1));
            visited[p.row + 1][p.col] = true;
        }
  
        // moving left
        if (p.col - 1 >= 0 &&
            visited[p.row][p.col - 1] == false) {
            q.push(new QItem(p.row, p.col - 1, p.dist + 1));
            visited[p.row][p.col - 1] = true;
        }
  
         // moving right
        if (p.col + 1 < M &&
            visited[p.row][p.col + 1] == false) {
            q.push(new QItem(p.row, p.col + 1, p.dist + 1));
            visited[p.row][p.col + 1] = true;
        }
    }
    return -1;
  }

}

export { Player };