const Model = require('../models/gym_model')

const createGym = async (req, res) => {
  const gym = req.body
  let user_id = req.user.id
  gym.creator_id = user_id
  let result = await Model.createGym(gym)
  res.json(result);
};

const updateGym = async (req, res) => {
  const gym = req.body
  let user = req.user
  gym.creator_id = user.id
  let result = await Model.updateGym(gym)
  res.json(result);
};

const getGyms = async (req, res) => {
  let result = await Model.getGyms()
  res.json(result)
}

const deleteGym = async (req, res) => {
  id = req.params.id
  let result = await Model.deleteGym(id)
  res.json(result)
}

const getOwnedGyms = async (req, res) => {
  let user = req.user
  let gyms = await Model.getOwnedGyms(user)

  for (let gym of gyms) {
    gym.label = gym.name
    gym.value = gym.id
  }
  
  res.json(gyms)
}

module.exports = {
  createGym,
  getGyms,
  updateGym,
  deleteGym,
  getOwnedGyms
}