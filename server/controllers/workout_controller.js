const Workout = require('../models/workout_model')

const getWorkoutMovements = async (req, res) => {
  let workout_id = req.params.workout_id
  let result = await Workout.getWorkoutMovements(workout_id)
  res.json(result)
}

const updateOnlyWorkout = async(req, res) => {
  let updatedWorkout = req.body
  
  if(!updatedWorkout.name) return res.status(400).json({error: 'Workout name cannot be emtpy'})
  if(updatedWorkout.round < 0 || updatedWorkout.extra_count < 0 || updatedWorkout.minute < 0 || updatedWorkout.extra_sec < 0) return res.status(400).json({error:'Round, extra rep, minute, or extra sec must >= 0 or leave empty'})
  if(updatedWorkout.extra_sec > 59) return res.status(400).json({error:'Extra sec must < 60'})

  let tempWorkoutSum = 0
  for (let property in updatedWorkout){
    if(updatedWorkout[property] > 0 && (property == 'round' || property == 'extra_count' || property == 'minute' || property == 'extra_sec')) tempWorkoutSum += updatedWorkout[property]
    if(!updatedWorkout[property]) updatedWorkout[property] = null
  }
  if(tempWorkoutSum == 0) return res.status(400).json({error:'Aleast one of the measures (round, extra rep, minute, or extra sec) should > 0'})

  delete updatedWorkout.movements
  let result = await Workout.updateOnlyWorkout(updatedWorkout)
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
  for (let property in workoutMovement) {
    if(workoutMovement[property] < 0 || workoutMovement[property] === '0') return res.status(400).json({error: 'Kg, rep, meter, cal, or sec must > 0'})
    if(!workoutMovement[property]) workoutMovement[property] = null
  }
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
  if(workout.round < 0 || workout.extra_count < 0 || workout.minute < 0 || workout.extra_sec < 0) return res.status(400).json({error:'Round, extra rep, minute, or extra sec must >= 0 or leave empty'})
  if(workout.extra_sec > 59) return res.status(400).json({error:'Extra sec must < 60'})
  
  let tempWorkoutSum = 0
  for (let property in workout){
    if(workout[property] > 0 && (property == 'round' || property == 'extra_count' || property == 'minute' || property == 'extra_sec')) tempWorkoutSum += workout[property]
    if(!workout[property]) workout[property] = null
  }
  if(tempWorkoutSum == 0) return res.status(400).json({error:'Aleast one of the measures (round, extra rep, minute, or extra sec) should > 0'})
   

  for (let movement of workout.movementArr) {
    for (let property in movement) {
      if(movement[property] < 0 || movement[property] === '0') return res.status(400).json({error: 'Kg, rep, meter, cal, or sec must > 0'})
      if(!movement[property]) movement[property] = null
    }
  }
  
  let user = req.user
  workout.creator_id = user.id
  let result = await Workout.createWorkoutWithMovement(workout)
  res.json(result)

}

// const createWorkout = async (req, res) => {
//   const workout = req.body
//   let user = req.user
//   workout.creator_id = user.id
//   let result = await Workout.createWorkout(workout)
//   res.json(result);
// };

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
  // createWorkout,
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
  updateOnlyWorkout,
  getWorkoutMovements
}