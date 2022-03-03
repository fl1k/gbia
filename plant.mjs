class Plant {
  constructor(jsonObj) {
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
}

const plantType =
{
  ANEMONE_FLOWER: 3,
  BLUE_JAZZ: 4,
  CROCUS_FLOWER: 5,
  TULIP: 6
}

export { Plant, plantType };