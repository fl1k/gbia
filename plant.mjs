class Plant {
  constructor(world, jsonObj) {
    console.log("PLANT JSONOBJ");
    console.log(jsonObj);
    this.world = world;
    this.plantId = jsonObj.plantId;
    this.goldWorth = jsonObj.goldWorth;
    this.waterNeeded = jsonObj.waterNeeded;
    this.daysToRot = jsonObj.daysToRot;
  }

  getNameById(id) {
    if (id == 3) return "ANEMONE_FLOWER";
    else if (id == 4) return "BLUE_JAZZ";
    else if (id == 5) return "CROCUS_FLOWER";
    else if (id == 6) return "TULIP";
    return "None";
  }

  willSurviveTheRain() 
  {
    switch (this.plantId) 
    {
      case plantType.ANEMONE_FLOWER:
        if (this.world.daysTillRain <= 2)
          return false;
        return true;

      case plantType.BLUE_JAZZ:
        if (this.world.daysTillRain <= 2)
          return false;
        return true;

      case plantType.CROCUS_FLOWER:
        if (this.world.daysTillRain <= 5)
          return false;
        return true;
      case plantType.TULIP:
        if (this.world.daysTillRain == 1)
          return false;
        return true;
    }
  }
}

const plantType =
{
  ANEMONE_FLOWER: 3,
  BLUE_JAZZ: 4,
  CROCUS_FLOWER: 5,
  TULIP: 6
}

export { Plant, plantType };