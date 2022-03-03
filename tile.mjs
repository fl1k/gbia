import {Plant} from './plant.mjs';

class Tile {
  constructor(jsonObj) {
    this.x = jsonObj.x;
    this.y = jsonObj.y;
    this.bIsPlanted = jsonObj.bIsPlanted;
    this.bIsSpecial = jsonObj.bIsSpecial;
    if(this.bIsPlanted)
      this.plant = new Plant(jsonObj.plantDTO);
  }
}

export { Tile };