import { Plant } from './plant.mjs';
import { World } from './world.mjs';

export const tileOwner = {
  none: 0,
  local: 1,
  enemy: 2
};

class Tile {
  constructor(world, jsonObj) {
    console.log("JOVB");
    console.log(jsonObj);
    this.world = world;
    this.x = jsonObj.x;
    this.y = jsonObj.y;
    this.bIsPlanted = jsonObj.bIsPlanted;
    this.bIsSpecial = jsonObj.bIsSpecial;
    this.owner = tileOwner.none;
    if (this.bIsPlanted)
      this.plant = new Plant(this.world, jsonObj.plantDTO);
  }

  update(jsonObj) {
    // plant uvek ostaje updatovan jer se konstantno pravi novi objekat
    this.bIsPlanted = jsonObj.bIsPlanted;
    if (this.bIsPlanted)
      this.plant = new Plant(this.world, jsonObj.plantDTO);
    else
      this.plant = null;
  }
}

export { Tile };