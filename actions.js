// Action Classes
class Action 
{
    constructor(x, y, cardId, amount) 
    {
      this.x = x;
      this.y = y;
      this.cardId = cardId;
      this.amount = amount;
    }
  }
  
class InputAction 
{
  constructor(actionType, properties) {
    this.actionType = actionType;
    this.properties = properties;
  }
}

const actionType = {
  
}
  
  function botInput(dto) {
    const inputAction = new InputAction("H", null);
    return JSON.stringify(inputAction);
  }
  
  module.exports = { botInput };
  