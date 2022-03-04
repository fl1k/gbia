import { Card } from './card.mjs';
import { tileOwner } from './tile.mjs'


class QItem {

  constructor(x, y, w, next) {
    this.row = x;
    this.col = y;
    this.dist = w;
    this.next = next;
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

  getClosestSpecial()
  {
    let shortest = 100;
    for(let i in this.tiles)
    {   
      let x = this.getShortestPath(this.tiles[i], this.world.specialTiles[j]);
      if(x < shortest)
        shortest = x;   
    }
  }

  getNearestSpecialTile()
  {
    const helper = (start) => {var source = new QItem(start.x, start.y, 0, null);
      let neededIndex = pos.x * 8 + pos.y;
      // To keep track of visited QItems. Marking
      // blocked cells as visited.
      var visited = Array(64).fill(0);
      for (var i = 0; i < 8; i++) {
          for (var j = 0; j < 8; j++)
          {
            let index = i * 8 + j;
              if (this.world.tiles[index].tileOwner == tileOwner.enemy)
                  visited[i][j] = true;
              else
                  visited[i][j] = false;
          }
      }
   
      // applying BFS on matrix cells starting from source
      var q = [];
      q.push(source);
      visited[source.row * 8 + source.col] = true;
      while (q.length!=0) 
      {
          var p = q[0];
          q.shift();
   
          // Destination found;
          let tile = this.world.getTile(p.row, p.col);
          if (tile.bIsSpecial && tile.owner == tileOwner.none)
              return {tile: tile, dist: p.dist};
   
          // moving up
          if (p.row - 1 >= 0 &&
              visited[(p.row - 1) * 8 +p.col] == false) 
              {
              if(p.next == null)
                q.push(new QItem(p.row - 1, p.col, p.dist + 1, {x: p.row - 1, y: p.col}));
              else
                q.push(new QItem(p.row - 1, p.col, p.dist + 1, q.next));
              visited[(p.row - 1) * 8 + p.col] = true;
          }
   
          // moving down
          if (p.row + 1 < 8 &&
              visited[(p.row + 1) * 8 + p.col] == false) {
              if(p.next == null)
                q.push(new QItem(p.row + 1, p.col, p.dist + 1, {x: p.row + 1, y: p.col}));
              else
                q.push(new QItem(p.row + 1, p.col, p.dist + 1, q.next));
              visited[(p.row + 1) * 8 + p.col] = true;
          }
   
          // moving left
          if (p.col - 1 >= 0 &&
              visited[p.row * 8 + (p.col - 1)] == false) {
              if(p.next == null)
                q.push(new QItem(p.row, p.col - 1, p.dist + 1, {x: p.row, y: p.col - 1}));
              else
                q.push(new QItem(p.row, p.col - 1, p.dist + 1, q.next));
              visited[p.row * 8  + (p.col - 1)] = true;
          }
   
           // moving right
          if (p.col + 1 < 8 &&
              visited[p.row * 8 + (p.col + 1)] == false) 
              {
                if(p.next == null)
                  q.push(new QItem(p.row, p.col + 1, p.dist + 1, {x: p.row, y: p.col + 1}));
                else
                  q.push(new QItem(p.row, p.col + 1, p.dist + 1, q.next));
              visited[p.row * 8 + (p.col + 1)] = true;
          }

                // moving right down
                if (p.col + 1 < 8 && p.row + 1 < 8 &&
                  visited[(p.row + 1) * 8 + (p.col + 1)] == false) 
                  {
                    if(p.next == null)
                      q.push(new QItem(p.row + 1, p.col + 1, p.dist + 1, {x: p.row + 1, y: p.col + 1}));
                    else
                      q.push(new QItem(p.row + 1, p.col + 1, p.dist + 1, q.next));
                  visited[(p.row + 1)* 8 + (p.col + 1)] = true;
              }

               // moving right up
               if (p.col + 1 < 8 && p.row - 1 >= 0 &&
                visited[(p.row - 1)* 8 + (p.col + 1)] == false) 
                {
                  if(p.next == null)
                    q.push(new QItem(p.row - 1, p.col + 1, p.dist + 1, {x: p.row - 1, y: p.col + 1}));
                  else
                    q.push(new QItem(p.row - 1, p.col + 1, p.dist + 1, q.next));
                visited[(p.row - 1)* 8 + (p.col + 1)] = true;
            }


                // moving left down

            if (p.col - 1 >= 0 && p.row + 1 < 8 &&
              visited[(p.row + 1) * 8 + (p.col - 1)] == false) 
              {
                if(p.next == null)
                  q.push(new QItem(p.row + 1, p.col - 1, p.dist + 1, {x: p.row + 1, y: p.col - 1}));
                else
                  q.push(new QItem(p.row + 1, p.col - 1, p.dist + 1, q.next));
              visited[(p.row + 1)* 8 + (p.col - 1)] = true;
          }

           // moving left up
           if (p.col -1>=0 && p.row - 1>=0 &&
            visited[(p.row - 1)* 8 + (p.col - 1)] == false) 
            {
              if(p.next == null)
                q.push(new QItem(p.row - 1, p.col - 1, p.dist - 1, {x: p.row - 1, y: p.col - 1}));
              else
                q.push(new QItem(p.row - 1, p.col - 1, p.dist - 1, q.next));
            visited[(p.row - 1)* 8 + (p.col - 1)] = true;
        }
      }
      return -1;
    }; 
    let min = 999;
    let tile = null;
    for(let i in this.tiles)
    {
      let data = helper(this.tiles[i]);
      if(min > data.dist)
       {
         min = data.dist;
         tile = data.tile;
       }
    }

    return tile;
  }
   

}


export { Player };