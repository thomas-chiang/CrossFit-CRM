const Workout = require('../models/workout_model')

const getWorkoutMovements = async (req, res) => {
  let workout_id = req.params.workout_id
  let result = await Workout.getWorkoutMovements(workout_id)
  res.json(result)
}

const updateOnlyNameAndNote = async(req, res) => {
  let updatedWorkout = req.body
  if(!updatedWorkout.name) return res.status(400).json({error: 'Workout name cannot be emtpy'})
  delete updatedWorkout.movements
  let result = await Workout.updateOnlyNameAndNote(updatedWorkout)
  res.json(result)
}


const addWorkoutMovement = async(req, res) => {
  let newWorkoutMovement = req.body
  let result = await Workout.addWorkoutMovement(newWorkoutMovement)
  res.json(result)
}

const getWorkout = async (req, res) => {
  let workout_id = req.params.workout_id
  let obj = await Workout.getWorkout(workout_id)
  let arr = Object.keys(obj).map(workout_id => obj[workout_id])
  res.json(arr[0])
}

const deleteWorkoutMovement = async (req, res) => {
  let workout_movement_id = req.params.workout_movement_id
  let result = await Workout.deleteWorkoutMovement(workout_movement_id)
  res.json(result)
}

const updateWorkoutMovement = async (req, res) => {
  let workoutMovement = req.body
  delete workoutMovement.name
  let result = await Workout.updateWorkoutMovement(workoutMovement)
  res.json(result)
}

const getWorkoutMovement = async (req, res) => {
  let workout_movement_id = req.params.workout_movement_id
  let [result] = await Workout.getWorkoutMovement(workout_movement_id)
  res.json(result)
}

const createWorkoutWithMovement = async (req, res) => {
  const workout = req.body
  if(!workout.name) return res.status(400).json({error:'Workout name cannot be empty'})
  let user = req.user
  workout.creator_id = user.id
  let result = await Workout.createWorkoutWithMovement(workout)
  res.json(result);
};

const createWorkout = async (req, res) => {
  const workout = req.body
  let user = req.user
  workout.creator_id = user.id
  let result = await Workout.createWorkout(workout)
  res.json(result);
};

const updateWorkout = async (req, res) => {
  const updatedWorkout = req.body
  let user = req.user
  updatedWorkout.creator_id = user.id
  let result = await Workout.updateWorkout(updatedWorkout)
  res.json(result);
};

const getWorkouts = async (req, res) => {
  let workouts = await Workout.getWorkouts()
  for (let workout of workouts){
    workout.value = workout.id
    workout.label = workout.name
  }
  res.json(workouts)
}

const getOwnedWorkouts = async (req, res) => {
  let user = req.user
  let result = await Workout.getOwnedWorkouts(user)
  res.json(result)
}

const deleteWorkout = async (req, res) => {
  workout_id = req.params.workout_id
  let result = await Workout.deleteWorkout(workout_id)
  res.json(result)
}

const getWorkoutsWithMovements = async (req, res) => {
  let obj = await Workout.getWorkoutsWithMovements()
  let arr = Object.keys(obj).map(workout_id => obj[workout_id])
  res.json(arr)
}

const getOwnedWorkoutsWithMovements = async (req, res) => {
  let user = req.user
  let obj = await Workout.getOwnedWorkoutsWithMovements(user)

  let arr = Object.keys(obj).map(workout_id => obj[workout_id])
  res.json(arr)
}

const deleteWorkoutWorkoutWithMovements = async (req, res) => {
  let workout = req.body
  if(!workout.id || !workout.movements) return res.status(400).json({error: 'incomplete workout info'})
  let result = await Workout.deleteWorkoutWithMovements(workout)
  res.json(result)
}


module.exports = {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  getOwnedWorkouts,
  createWorkoutWithMovement,
  getWorkoutsWithMovements,
  getOwnedWorkoutsWithMovements,
  deleteWorkoutWorkoutWithMovements,
  getWorkoutMovement,
  updateWorkoutMovement,
  deleteWorkoutMovement,
  getWorkout,
  addWorkoutMovement,
  updateOnlyNameAndNote,
  getWorkoutMovements
}