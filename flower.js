class Flower
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
    anemone: new Flower(3, 2, 5, 2000),
    blueJazz: new Flower(4, 2, 4, 2500),
    crocus: new Flower(5, 5, 4, 5000),
    tulip: new Flower(6, 1, 3, 8000)
}

const flowerArray = {anemone, blueJazz, crocus, tulip};

export {Flower, flowers, flowerArray};