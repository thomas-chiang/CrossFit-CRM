const Movement = require('../models/movement_model')

const createMovement = async (req, res) => {
  const movement = req.body
  if (!movement.name) return res.status(400).json({error:'Movement name cannot be empty'})
  let user = req.user
  movement.creator_id = user.id
  let result = await Movement.createMovement(movement)
  res.json(result);
};

const updateMovement = async (req, res) => {
  const movement = req.body
  if (!movement.name) return res.status(400).json({error:'Movement name cannot be empty'})
  let user = req.user
  movement.creator_id = user.id
  let result = await Movement.updateMovement(movement)
  res.json(result);
};

const getMovements = async (req, res) => {
  let result = await Movement.getMovements()
  for (let item of result) {
    item.value = item.id
    item.label = item.name
  }
  res.json(result)
}

const deleteMovement = async (req, res) => {
  id = req.params.id
  let result = await Movement.deleteMovement(id)
  res.json(result)
}


module.exports = {
  createMovement,
  getMovements,
  updateMovement,
  deleteMovement
}