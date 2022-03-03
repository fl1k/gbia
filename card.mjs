class Card
{
    constructor(jsonObj)
    {
        this.cardId = jsonObj.cardId;
        this.owned = jsonObj.owned;
    }
}

const cardIds = {
    water: 0,
    mole: 1,
    fertilizer: 2,
    anemoneFlower: 3,
    blueJazz: 4,
    crocusFlower: 5,
    tulip: 6
}

export {Card, cardIds};