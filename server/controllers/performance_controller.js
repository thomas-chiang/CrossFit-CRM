const Performance = require("../models/performance_model");
const Workout = require("../models/workout_model");
const Utils = require("../../utils/util");
const { LEADERBOARD_LIMIT, ANALYSIS_LIMIT } = process.env;

const getPerformanceByMovement = async (req, res) => {
  const { user_id, movement_id } = req.query;
  let result = await Performance.getPerformanceByUserMovement(user_id, movement_id);
  res.json(result);
};

const getPerformanceByUserMovement = async (req, res) => {
  let user_id = req.user.id;
  let movement_id = req.params.movement_id;
  let result = await Performance.getPerformanceByUserMovement(user_id, movement_id);
  res.json(result);
};

const getPerformanceWithMovementWorkoutName = async (req, res) => {
  let performance_id = req.params.performance_id;
  let result = await Performance.getPerformanceWithMovementWorkoutName(performance_id);
  res.json(result[0]);
};

const updatePerformance = async (req, res) => {
  let performance = req.body;
  delete performance.name;

  let unitArr = [
    performance.round,
    performance.extra_count,
    performance.minute,
    performance.extra_sec,
    performance.kg,
    performance.rep,
    performance.meter,
    performance.cal
  ];
  if (!Utils.isStringArrPositiveIntegersOrZeros(unitArr))
    return res
      .status(400)
      .json({ error: "Round, extra rep, minute, extra sec, kg, rep, meter, or cal must be positive integer, 0, or leave empty" });

  if (Utils.unitTotalForWorkout(performance) == 0)
    return res.status(400).json({ error: "At least one of the measures (Round, extra rep, minute, or extra sec) should > 0" });

  if (Utils.unitTotalForMovement(performance) == 0)
    return res.status(400).json({ error: "At least one of the measures (Kg, rep, meter, or cal) should > 0" });

  let result = await Performance.updatePerformance(performance);
  res.json(result);
};

const deletePerformance = async (req, res) => {
  let performance = req.body;
  let result = await Performance.deletePerformance(performance);
  res.json(result);
};

const createPerformance = async (req, res) => {
  let performance = req.body;

  let unitArr = [
    performance.round,
    performance.extra_count,
    performance.minute,
    performance.extra_sec,
    performance.kg,
    performance.rep,
    performance.meter,
    performance.cal
  ];
  if (!Utils.isStringArrPositiveIntegersOrZeros(unitArr))
    return res
      .status(400)
      .json({ error: "Round, extra rep, minute, extra sec, kg, rep, meter, or cal must be positive integer, 0, or leave empty" });

  if (Utils.unitTotalForWorkout(performance) == 0)
    return res.status(400).json({ error: "At least one of the measures (Round, extra rep, minute, or extra sec) should > 0" });

  if (Utils.unitTotalForMovement(performance) == 0)
    return res.status(400).json({ error: "At least one of the measures (Kg, rep, meter, or cal) should > 0" });
  let result = await Performance.createPerformacne(performance);
  res.json(result);
};

const getPerformancesByCourseUser = async (req, res) => {
  const { course_id, user_id } = req.query;
  let result = await Performance.getPerformancesByCourseUser(course_id, user_id);
  res.json(result);
};

const getLeader = async (req, res) => {
  const { course_id, user_id, workout_id } = req.query;
  let result = await Performance.getLeader(course_id, user_id, workout_id);
  res.json(result);
};

const getUserWorkouts = async (req, res) => {
  let user_id = req.params.user_id;
  let result = await Performance.getUserWorkouts(user_id);
  res.json(result);
};

const getSortedLeadersByWorkouts = async (req, res) => {
  let workout_ids = req.query.workout_ids;
  if (typeof workout_ids === "string") workout_ids = [workout_ids];

  let workoutsWithLeaders = [];
  for (let workout_id of workout_ids) {
    let objWithWorkoutIdAsKey = await Workout.getWorkout(workout_id);
    let workoutWithMovements = objWithWorkoutIdAsKey[workout_id];
    // let numberOfMovements = workoutWithMovements.movements.length;
    let performances = await Performance.getLeadersByWorkout(workout_id /* , numberOfMovements, parseInt(LEADERBOARD_LIMIT) */);
    let objWithCourseIdUserIdAsKey = Utils.convertToCalculatedObjWithIdsAsKey(performances);
    let LeadersArr = Utils.convertToArrWithLeaderScore(workout_id, objWithCourseIdUserIdAsKey);
    LeadersArr.sort((a, b) => b.score - a.score);

    workoutWithMovements.leaders = LeadersArr.slice(0, LEADERBOARD_LIMIT);
    workoutsWithLeaders.push(workoutWithMovements);
  }

  res.json(workoutsWithLeaders);
};

const getPerformanceByWorkoutMovement = async (req, res) => {
  const { movement_id, user_id, workout_id } = req.query;
  let result = await Performance.getPerformanceByWorkoutMovement(user_id, workout_id, movement_id);
  res.json(result);
};

// analysis bar
const getPerformanceByWorkout = async (req, res) => {
  const { movement_ids, user_id, workout_id } = req.query;
  if (typeof movement_ids === "string") movement_ids = [movement_ids];

  let movementArr = [];
  for (let movement_id of movement_ids) {
    let numberOfMovements = await Performance.numberOfSameMovementInWorkout(workout_id, movement_id);
    movementArr.push(
      await Performance.getPerformanceByWorkoutMovement(
        user_id,
        workout_id,
        movement_id,
        numberOfMovements * parseInt(ANALYSIS_LIMIT)
      )
    );
  }
  res.json(movementArr);
};

module.exports = {
  createPerformance,
  getPerformancesByCourseUser,
  deletePerformance,
  updatePerformance,
  getPerformanceWithMovementWorkoutName,
  getPerformanceByUserMovement,
  getPerformanceByMovement,
  getSortedLeadersByWorkouts,
  getLeader,
  getUserWorkouts,
  getPerformanceByWorkoutMovement,
  getPerformanceByWorkout
};
