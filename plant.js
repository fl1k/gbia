class Plant 
{
  constructor(plantId, goldWorth, waterNeeded, daysToRot)
   {
    this.plantId = plantId;
    this.goldWorth = goldWorth;
    this.waterNeeded = waterNeeded;
    this.daysToRot = daysToRot;
  }

  getNameById(id) {
    if (id == 3) return "ANEMONE_FLOWER";
    else if (id == 4) return "BLUE_JAZZ";
    else if (id == 5) return "CROCUS_FLOWER";
    else if (id == 6) return "TULIP";
    return "None";
  }
}

module.exports = Plant;