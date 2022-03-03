class Tile 
{
  constructor(x, y, bIsPlanted, bIsSpecial, plantDTO) {
    this.x = x;
    this.y = y;
    this.bIsPlanted = bIsPlanted;
    this.bIsSpecial = bIsSpecial;
    this.plantDTO = plantDTO;
  }
}

module.exports = Tile;