const Performance = require('../models/performance_model')

const getPerformanceByUserMovement = async (req, res) => {
  let user_id = req.user.id
  let movement_id = req.params.movement_id
  let result = await Performance.getPerformanceByUserMovement(user_id, movement_id)
  res.json(result)
}

const getPerformanceWithMovementWorkoutName = async (req, res) => {
  let performance_id = req.params.performance_id
  let result = await Performance.getPerformanceWithMovementWorkoutName(performance_id)
  res.json(result[0])
}

const updatePerformance = async (req, res) => {
  let performance = req.body
  delete performance.name
  let result = await Performance.updatePerformance(performance)
  res.json(result)
}

const deletePerformance = async (req, res) => {
  let performance = req.body
  let result = await Performance.deletePerformance(performance)
  res.json(result)
}

const createPerformance = async (req, res) => {
  let performance = req.body
  let result = await Performance.createPerformacne(performance)
  res.json(result)
}

const getPerformancesByCourseUser = async (req, res) => {
  let course_id = req.query.course_id
  let user_id = req.query.user_id
  let result = await Performance.getPerformancesByCourseUser(course_id, user_id)
  res.json(result)
}

module.exports = {
  createPerformance,
  getPerformancesByCourseUser,
  deletePerformance,
  updatePerformance,
  getPerformanceWithMovementWorkoutName,
  getPerformanceByUserMovement
}