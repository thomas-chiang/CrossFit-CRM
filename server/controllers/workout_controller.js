const Workout = require("../models/workout_model");
const Utils = require("../../utils/util");

const getWorkoutMovements = async (req, res) => {
  let workout_id = req.params.workout_id;
  let result = await Workout.getWorkoutMovements(workout_id);
  res.json(result);
};

const updateOnlyWorkout = async (req, res) => {
  let updatedWorkout = req.body;
  let unitArr = [updatedWorkout.round, updatedWorkout.extra_count, updatedWorkout.minute, updatedWorkout.extra_sec];

  if (!updatedWorkout.name) return res.status(400).json({ error: "Workout name cannot be emtpy" });

  if (!Utils.isStringArrPositiveIntegersOrZeros(unitArr))
    return res.status(400).json({
      error: "Round, extra rep, minute, or extra sec must be positive integer, 0, or leave empty"
    });

  if (Utils.isStringArrItemLargerThan1M(unitArr))
    return res.status(400).json({
      error: "Round, extra rep, minute, or extra sec must < 1000000"
    });

  if (updatedWorkout.extra_sec > 59) return res.status(400).json({ error: "Extra sec must < 60" });

  if (Utils.unitTotal(updatedWorkout) == 0)
    return res.status(400).json({
      error: "Aleast one of the measures (round, extra rep, minute, or extra sec) should > 0"
    });

  delete updatedWorkout.movements;
  let result = await Workout.updateOnlyWorkout(updatedWorkout);
  res.json(result);
};

const addWorkoutMovement = async (req, res) => {
  let newWorkoutMovement = req.body;

  let unitArr = [newWorkoutMovement.kg, newWorkoutMovement.rep, newWorkoutMovement.meter, newWorkoutMovement.cal];
  if (!Utils.isStringArrPositiveIntegersOrZeros(unitArr))
    return res.status(400).json({
      error: "Kg, rep, meter, or cal must be positive integer, 0, or leave empty"
    });

  if (Utils.isStringArrItemLargerThan1M(unitArr)) return res.status(400).json({ error: "Kg, rep, meter, or cal must < 1000000" });

  if (Utils.unitTotal(newWorkoutMovement) == 0)
    return res.status(400).json({
      error: "At least one of the measures (Kg, rep, meter, or cal) should > 0"
    });

  let result = await Workout.addWorkoutMovement(newWorkoutMovement);
  res.json(result);
};

const getWorkout = async (req, res) => {
  let workout_id = req.params.workout_id;
  let obj = await Workout.getWorkout(workout_id);
  let arr = Object.keys(obj).map((workout_id) => obj[workout_id]);
  res.json(arr[0]);
};

const deleteWorkoutMovement = async (req, res) => {
  let workout_movement_id = req.params.workout_movement_id;
  let result = await Workout.deleteWorkoutMovement(workout_movement_id);
  res.json(result);
};

const updateWorkoutMovement = async (req, res) => {
  let workoutMovement = req.body;
  let unitArr = [workoutMovement.kg, workoutMovement.rep, workoutMovement.meter, workoutMovement.cal];

  if (!Utils.isStringArrPositiveIntegersOrZeros(unitArr))
    return res.status(400).json({
      error: "Kg, rep, meter, or cal must be positive integer, 0, or leave empty"
    });

  if (Utils.isStringArrItemLargerThan1M(unitArr)) return res.status(400).json({ error: "Kg, rep, meter, or cal must < 1000000" });

  if (Utils.unitTotal(workoutMovement) == 0)
    return res.status(400).json({
      error: "At least one of the measures (Kg, rep, meter, or cal) should > 0"
    });

  delete workoutMovement.name;
  let result = await Workout.updateWorkoutMovement(workoutMovement);
  res.json(result);
};

const getWorkoutMovement = async (req, res) => {
  let workout_movement_id = req.params.workout_movement_id;
  let [result] = await Workout.getWorkoutMovement(workout_movement_id);
  res.json(result);
};

const createWorkoutWithMovements = async (req, res) => {
  const workout = req.body;
  let unitArr = [workout.round, workout.extra_count, workout.minute, workout.extra_sec];

  if (!workout.name) return res.status(400).json({ error: "Workout name cannot be empty" });

  if (!Utils.isStringArrPositiveIntegersOrZeros(unitArr))
    return res.status(400).json({
      error: "Round, extra rep, minute, or extra sec must be positive integer, 0, or leave empty"
    });

  if (Utils.isStringArrItemLargerThan1M(unitArr))
    return res.status(400).json({ error: "Round, extra rep, minute, or extra sec must < 1000000" });

  if (workout.extra_sec > 59) return res.status(400).json({ error: "Extra sec must < 60" });

  if (Utils.unitTotal(workout) == 0)
    return res.status(400).json({
      error: "Aleast one of the WORKOUT measures (round, extra rep, minute, or extra sec) should > 0"
    });

  for (let movement of workout.movementArr) {
    let unitArr = [movement.kg, movement.rep, movement.meter, movement.cal];
    if (!Utils.isStringArrPositiveIntegersOrZeros(unitArr))
      return res.status(400).json({
        error: "For every MOVEMENT, Kg, rep, meter, or cal must be positive integer, 0, or leave empty"
      });

    if (Utils.isStringArrItemLargerThan1M(unitArr))
      return res.status(400).json({ error: "Kg, rep, meter, or cal must < 1000000" });

    if (Utils.unitTotal(movement) == 0)
      return res.status(400).json({
        error: "For every MOVEMENT, at least one of the measures (Kg, rep, meter, or cal) should > 0"
      });
  }

  let user = req.user;
  workout.creator_id = user.id;
  let result = await Workout.createWorkoutWithMovements(workout);
  res.json(result);
};

const updateWorkout = async (req, res) => {
  const updatedWorkout = req.body;
  let user = req.user;
  updatedWorkout.creator_id = user.id;
  let result = await Workout.updateWorkout(updatedWorkout);
  res.json(result);
};

const getWorkouts = async (req, res) => {
  let workouts = await Workout.getWorkouts();
  Utils.addReactSelectProperties(workouts, "id", "name");
  res.json(workouts);
};

const deleteWorkout = async (req, res) => {
  workout_id = req.params.workout_id;
  let result = await Workout.deleteWorkout(workout_id);
  res.json(result);
};

const getWorkoutsWithMovements = async (req, res) => {
  let obj = await Workout.getWorkoutsWithMovements();
  let arr = Object.keys(obj).map((workout_id) => obj[workout_id]);
  res.json(arr);
};

const getDistinctWorkoutMovements = async (req, res) => {
  let workout_id = req.params.workout_id;
  let results = await Workout.getDistinctWorkoutMovements(workout_id);

  Utils.addYoutubeIdProperty(results);
  Utils.addYoutubeEmbedLinkProperty(results);
  Utils.addReactSelectProperties(results, "id", "name");

  res.json(results);
};

module.exports = {
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  createWorkoutWithMovements,
  getWorkoutsWithMovements,
  getWorkoutMovement,
  updateWorkoutMovement,
  deleteWorkoutMovement,
  getWorkout,
  addWorkoutMovement,
  updateOnlyWorkout,
  getWorkoutMovements,
  getDistinctWorkoutMovements
};
