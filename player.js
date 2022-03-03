class Player 
{
  constructor(points, gold, fertilizerActive, tiles, cards) {
    this.points = points;
    this.gold = gold;
    this.fertilizerActive = fertilizerActive;
    this.tiles = tiles;
    this.cards = cards;
  }
}

module.exports = Player;