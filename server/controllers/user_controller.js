require("dotenv").config();
const { BCRYPT_SALT, TOKEN_EXPIRE, TOKEN_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const moment = require("moment");
const Utils = require("../../utils/util");

const signUp = async (req, res) => {
  //check input format
  const { name, email, password, gender, role } = req.body;
  if (!name || !email || !password || !gender || !role)
    return res.status(400).json({ error: "Name, email, gender, role, and password are required." });
  if (name.length > 20 || password.length > 20)
    return res.status(400).json({ error: "Name or password cannot be more than 20 characters" });
  if (!validator.isEmail(email)) return res.status(400).json({ error: "Invalid email format" });
  if (email.length > 255) return res.status(400).json({ error: "Email cannot be more than 255 characters" });

  //handle input
  let user = req.body;
  user.password = bcrypt.hashSync(password, parseInt(BCRYPT_SALT));
  user.name = validator.escape(name);

  //save to db
  const result = await User.signUp(user);
  if (result.error && result.status === 403) return res.status(403).json({ error: result.error }); // if duplicate

  user = result.user;
  if (!user) return res.status(500).json({ error: "Failed to sign up. Please retry or reachout to the platform maintainer" });

  //handle output
  delete user.password;
  res.status(200).json({
    access_token: jwt.sign(user, TOKEN_SECRET, { expiresIn: parseInt(TOKEN_EXPIRE) }),
    user
  });
};

const signIn = async (req, res) => {
  //check input format
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ error: "Role, email, and password are required." });
  if (!validator.isEmail(email)) return res.status(400).json({ error: "Invalid email format" });

  //query db & validate
  const result = await User.signIn(role, email);
  if (!result.user || !bcrypt.compareSync(password, result.user.password))
    return res.status(400).json({ error: "Invalid email or password" });
  const user = result.user;

  //handle output
  delete user.password;
  res.status(200).json({
    access_token: jwt.sign(user, TOKEN_SECRET, {
      expiresIn: parseInt(TOKEN_EXPIRE)
    }),
    user
  });
};

const getUserProfile = async (req, res) => {
  let user = req.user;
  const result = await User.getUserProfile(user.role, user.email);
  user = result;
  delete user.password;
  res.status(200).json(user);
};

const getUsersByRole = async (req, res) => {
  const role = req.params.role;
  const users = await User.getUsersByRole(role);
  Utils.addReactSelectPropertiesForRole(users);
  res.status(200).json(users);
};

const getValidCoaches = async (req, res) => {
  const coaches = await User.getValidCoaches();
  Utils.addReactSelectProperties(coaches, "id", "name");
  res.status(200).json(coaches);
};

const getCoaches = async (req, res) => {
  const coaches = await User.getCoaches();
  Utils.addReactSelectProperties(coaches, "id", "name");
  res.status(200).json(coaches);
};

const updateValidStatus = async (req, res) => {
  const { user_id, valid_status } = req.query;
  const result = await User.updateValidStatus(user_id, valid_status);
  res.status(200).json(result);
};

const updateRole = async (req, res) => {
  const { user_id, role } = req.query;
  const result = await User.updateRole(user_id, role);
  res.status(200).json(result);
};

const insertPoint = async (req, res) => {
  const creator_id = req.user.id;
  const { user_id, point, behavior } = req.query;

  if (point == 0 || (point < 0 && behavior == "add") || (point > 0 && behavior == "deduct"))
    return res.status(400).json({ error: "Points must > 0" });

  if (Math.abs(point) > 2147483647)
    return res.status(400).json({ error: "Points added or deducted must < 2147483647 each time" });

  if (behavior == "deduct") {
    const available_point = await User.getAvailablePointsByUser(user_id);
    if (parseInt(available_point) + parseInt(point) < 0)
      return res.status(400).json({ error: "Cannot deduct more than available points" });
  }

  const time = new Date();
  const result = await User.insertPoint(user_id, point, creator_id, time);

  res.status(200).json(result);
};

const getPointsByUser = async (req, res) => {
  const user_id = req.params.user_id;

  const results = await User.getPointsByUser(user_id);

  for (let item of results) {
    item.time = moment(item.time).local().format("YYYY/MM/DD H:mm:ss A");
    if (item.course_time) item.course_time = moment(item.course_time).local().format("YYYY/MM/DD H:mm:ss A");
    Utils.convertRoleKeyFromNumberToString(item);
  }

  res.status(200).json(results);
};

const getSumPointsByUser = async (req, res) => {
  const user_id = req.params.user_id;
  const result = await User.getSumPointsByUser(user_id);
  res.status(200).json(result);
};

const deletePointById = async (req, res) => {
  const point_id = req.params.point_id;
  const result = await User.deletePointById(point_id);
  res.status(200).json(result);
};

module.exports = {
  signUp,
  signIn,
  getUserProfile,
  getUsersByRole,
  getValidCoaches,
  getCoaches,
  updateValidStatus,
  insertPoint,
  updateRole,
  getPointsByUser,
  getSumPointsByUser,
  deletePointById
};
