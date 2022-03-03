class Action {
    constructor(x, y, cardId, amount) {
        this.x = x;
        this.y = y;
        this.cardId = cardId;
        this.amount = amount;
    }
}

const actionType = {
    watering: 'W',
    buyLand: 'L',
    plant: 'P',
    buyCards: 'C',
    fertilizer: 'F',
    sendMole: 'M',
    harvest: 'H'
};

class InputAction {
  constructor(actionType, properties) {
    this.actionType = actionType;
    this.properties = properties;
  }

  toString() {
    return JSON.stringify(this);
  }
}

export { InputAction, Action, actionType};