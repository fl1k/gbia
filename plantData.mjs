class PlantData
{
    constructor(id, waterNeeded, lifetime, reward)
    {
        this.id = id;
        this.waterNeeded = waterNeeded;
        this.lifetime = lifetime;
        this.reward = reward;
    }
}

const flowers =
{
    anemone: new PlantData(3, 2, 5, 2000),
    blueJazz: new PlantData(4, 2, 4, 2500),
    crocus: new PlantData(5, 5, 4, 5000),
    tulip: new PlantData(6, 1, 3, 8000)
}

const flowerArray = {anemone, blueJazz, crocus, tulip};

export {PlantData, flowers, flowerArray};