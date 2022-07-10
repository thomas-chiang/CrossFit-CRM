require('dotenv').config()
const { BCRYPT_SALT, TOKEN_EXPIRE, TOKEN_SECRET } = process.env
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user_model');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
  //check input format
  let {name, email, password, gender} = req.body;
  if(!name || !email || !password || !gender) return res.status(400).json({error:'Request Error: name, email, gender, and password are required.'})
  if (!validator.isEmail(email)) return res.status(400).json({error:'Request Error: Invalid email format'})
  
  //handle input
  let user = req.body
  user.password = bcrypt.hashSync(password, parseInt(BCRYPT_SALT))
  user.name = validator.escape(name)

  //save to db
  const result = await User.signUp(user)
  if (result.error) return res.status(403).json({error: result.error});
  user = result.user;
  if (!user) return res.status(500).json({error: 'Database Query Error'});
  
  //handle output
  delete user.password
  res.status(200).json({    
    access_token: jwt.sign(user,TOKEN_SECRET,{ expiresIn: parseInt(TOKEN_EXPIRE) }),
    user
  });
};

const signIn = async (req, res) => { 
  //check input format
  let {email, password, role} = req.body;
  if(!email || !password || !role) return res.status(400).json({error:'Request Error: role, email, and password are required.'})
  if(!validator.isEmail(email)) return res.status(400).json({error:'Request Error: Invalid email format'})
  
  //query db & validate
  let result = await User.signIn(role, email)
  if(!result.user || !bcrypt.compareSync(password, result.user.password)) return res.status(400).json({error:'Request Error: Invalid email or password'})
  let user = result.user

  //handle output
  delete user.password
  res.status(200).json({    
    access_token: jwt.sign(user,TOKEN_SECRET,{ expiresIn: parseInt(TOKEN_EXPIRE) }),
    user
  });
};

const getUserProfile = async (req, res) => {
  let user = req.user

  let result = await User.getUserProfile(user.role, user.email)

  //let gyms = await User.getGymsByUser(user)

  user = result
  //user.gyms = gyms
  delete user.password

  res.status(200).json(user);
};

const getUsersByRole = async (req, res) => {
  let role = req.params.role
  let users = await User.getUsersByRole(role)
  for (let user of users) {
    user.value = user.id
    user.label = user.name
  }
  res.status(200).json(users);
};


const addUserToGymbyEmail = async (req, res) => {
  let email = req.body.email
  let gym_id = req.body.gym_id
  let result = await User.addUserToGymbyEmail(gym_id, email)
  res.status(200).json(result);
}

const getUsersByGymAndRole = async (req, res) => {
  let gym_id = req.query.gym_id
  let role = req.query.role
  let users = await User.getUsersByGymAndRole(gym_id, role)
  for (let user of users) {
    user.value = user.id
    user.label = user.name
  }
  res.status(200).json(users)
}

const deleteUserByGym = async (req, res) => {
  // let gym_id = parseInt(req.query.gym_id)
  // let user_id = parseInt(req.query.user_id)
  // console.log(req.query)
  let gym_id = req.query.gym_id
  let user_id = req.query.user_id
  let result = await User.deleteUserByGym(user_id, gym_id)
  res.status(200).json(result)
}

const getValidCoaches = async (req, res) => {
  let coaches = await User.getValidCoaches()
  for (let coach of coaches) {
    coach.label = coach.name
    coach.value = coach.id
  }

  res.status(200).json(coaches)
}

const getCoaches = async (req, res) => {
  let coaches = await User.getCoaches()
  for (let coach of coaches) {
    coach.label = coach.name
    coach.value = coach.id
  }

  res.status(200).json(coaches)
}

const updateValidStatus = async (req, res) => {
  let user_id = req.query.user_id
  let valid_status = req.query.valid_status
  let result = await User.updateValidStatus(user_id, valid_status)

  res.status(200).json(result)
}

const updatePoint = async (req, res) => {
  let user_id = req.query.user_id
  let point = req.query.point
  let result = await User.updatePoint(user_id, point)

  res.status(200).json(result)
}

const insertPoint = async (req, res) => {
  let creator_id = req.user.id
  let user_id = req.query.user_id
  let point = req.query.point
  let time = new Date()
  let result = await User.insertPoint(user_id, point, creator_id, time)

  res.status(200).json(result)
}

// const getPoint = async (req, res) => {
//   let user_id = req.params.user_id
//   let result = await User.getPoint(user_id)
  
//   res.status(200).json(result)
// }


module.exports = {
  signUp,
  signIn,
  getUserProfile,
  getUsersByRole,
  addUserToGymbyEmail,
  getUsersByGymAndRole,
  deleteUserByGym,
  getValidCoaches,
  getCoaches,
  updateValidStatus,
  updatePoint,
  insertPoint,
};