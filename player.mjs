class Player 
{
  constructor(jsonObj) 
  {
    this.points = jsonObj.points;
    this.gold = jsonObj.gold;
    this.fertilizerActive = jsonObj.fertilizerActive;
    this.tiles = jsonObj.tiles;
    this.cards = jsonObj.cards;
  }
}

export {Player};