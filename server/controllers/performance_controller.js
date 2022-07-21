const Performance = require('../models/performance_model')
const Workout = require('../models/workout_model')



const getPerformanceByMovement = async (req, res) => {
  let user_id = req.query.user_id
  let movement_id = req.query.movement_id
  let result = await Performance.getPerformanceByUserMovement(user_id, movement_id)
  res.json(result)
}

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
  let tempWorkoutSum = 0
  let tempPerformanceSum = 0
  for (let property in performance) {
    if(performance[property] > 0 && (property == 'round' || property == 'extra_count' || property == 'minute' || property == 'extra_sec')) 
      tempWorkoutSum += performance[property]

    if(performance[property] > 0 && (property == 'kg' || property == 'rep' || property == 'meter' || property == 'cal')) 
      tempPerformanceSum += performance[property]

    if(performance[property] < 0/*  || performance[property] === '0' */) 
      return res.status(400).json({error: 'Round, extra rep, minute, extra sec, kg, rep, meter, or cal must >= 0 or leave empty'})
      
    // if(!performance[property])performance[property]=null  // not set null
  }
  if(tempWorkoutSum == 0) return res.status(400).json({error: 'At least one of the measures (Round, extra rep, minute, or extra sec) should > 0'})
  if(tempPerformanceSum == 0) return res.status(400).json({error: 'At least one of the measures (Kg, rep, meter, or cal) should > 0'})
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
  let tempWorkoutSum = 0
  let tempPerformanceSum = 0
  for (let property in performance) {
    if(performance[property] > 0 && (property == 'round' || property == 'extra_count' || property == 'minute' || property == 'extra_sec')) 
      tempWorkoutSum += performance[property]

    if(performance[property] > 0 && (property == 'kg' || property == 'rep' || property == 'meter' || property == 'cal')) 
      tempPerformanceSum += performance[property]

    if(performance[property] < 0/*  || performance[property] === '0' */) 
      return res.status(400).json({error: 'Round, extra rep, minute, extra sec, kg, rep, meter, or cal must >= 0 or leave empty'})
      
    // if(!performance[property])performance[property]=null  // not set null
  }
  if(tempWorkoutSum == 0) return res.status(400).json({error: 'At least one of the measures (Round, extra rep, minute, or extra sec) should > 0'})
  if(tempPerformanceSum == 0) return res.status(400).json({error: 'At least one of the measures (Kg, rep, meter, or cal) should > 0'})
  let result = await Performance.createPerformacne(performance)
  res.json(result)
}

const getPerformancesByCourseUser = async (req, res) => {
  let course_id = req.query.course_id
  let user_id = req.query.user_id
  let result = await Performance.getPerformancesByCourseUser(course_id, user_id)
  res.json(result)
}



const getLeader = async (req, res) => {
  let course_id = req.query.course_id
  let user_id = req.query.user_id
  let workout_id = req.query.workout_id 
  let result = await Performance.getLeader(course_id, user_id, workout_id)

  res.json(result)
}

const getUserWorkouts = async (req, res) => {
  let user_id = req.params.user_id
  let result = await Performance.getUserWorkouts(user_id)
  res.json(result)
}





const getLeaderboardByWorkouts = async (req, res) => {
  let workout_ids = req.query.workout_ids
  if (typeof workout_ids === 'string') {
    workout_ids = [workout_ids]
  }
  
  let leaderboardArr = []
  for (let id of workout_ids) {

    let workoutWithMovements = await Workout.getWorkout(id)

    workoutWithMovements = workoutWithMovements[id]
    let movementsLength = workoutWithMovements.movements.length


    let arr = await Performance.getLeaderboardByWorkout(id, movementsLength)


    let obj = {}
    for (let item of arr) {
      let identifier = `${item.course_id} ${item.user_id}`
      obj[identifier]={
        name: item.name,
        ratio: obj[identifier]?.ratio  ?  obj[identifier].ratio * item.ratio : item.ratio,
        round_m: item.round_m,
        minute_m: item.minute_m,
        kg_m: obj[identifier]?.kg_m  ?  obj[identifier].kg_m * item.kg_m : item.kg_m,
        rep_m: obj[identifier]?.rep_m  ?  obj[identifier].rep_m * item.rep_m : item.rep_m,
        meter_m: obj[identifier]?.meter_m  ?  obj[identifier].meter_m * item.meter_m : item.meter_m,
        cal_m: obj[identifier]?.cal_m  ?  obj[identifier].cal_m * item.cal_m : item.cal_m,
      }
    }
  
    //console.log(obj)

    let LeadersArr = []
    for (let identifier in obj) {
      let course_id = identifier.substring(0, identifier.indexOf(' '))
      let user_id = identifier.substring(identifier.indexOf(' ') + 1)

      let leaderData = obj[identifier]

      let score = leaderData.ratio * leaderData.round_m * leaderData.minute_m * 100
      let name = leaderData.name 
      let round = leaderData.round_m * 100
      let minute = leaderData.minute_m * 100
      let kg = leaderData.kg_m * 100
      let rep = leaderData.rep_m * 100
      let meter = leaderData.meter_m * 100
      let cal = leaderData.cal_m * 100
      let other = leaderData.ratio * 100
      let round_minute = leaderData.round_m * leaderData.minute_m * 100
      
      LeadersArr.push({
        workout_id: id,
        course_id, 
        user_id,
        score,
        name,
        round,
        minute,
        kg,
        rep,
        meter,
        cal,
        other,
        round_minute
      })
    }
  
    LeadersArr.sort((a, b)=>b.score - a.score)

    workoutWithMovements.leaders = LeadersArr

    leaderboardArr.push(workoutWithMovements)
  }

  res.json(leaderboardArr)
}










const getPerformanceByWorkoutMovement = async (req, res) => {
  let user_id = req.query.user_id
  let workout_id = req.query.workout_id
  let movement_id = req.query.movement_id

  let result = await Performance.getPerformanceByWorkoutMovement(user_id, workout_id, movement_id)
  res.json(result)
}




const getPerformanceByWorkout = async (req, res) => {
  let user_id = req.query.user_id
  let workout_id = req.query.workout_id
  let movement_ids = req.query.movement_ids
  if (typeof movement_ids === 'string') {
    movement_ids = [movement_ids]
  }

  let movementArr = []

  for (let movement_id of movement_ids) {
    result = await Performance.getPerformanceByWorkoutMovement(user_id, workout_id, movement_id)
    movementArr.push(result)
  }

  res.json(movementArr)
}





module.exports = {
  createPerformance,
  getPerformancesByCourseUser,
  deletePerformance,
  updatePerformance,
  getPerformanceWithMovementWorkoutName,
  getPerformanceByUserMovement,
  getPerformanceByMovement,
  //getLeaderboardByWorkout,
  getLeaderboardByWorkouts,
  getLeader,
  getUserWorkouts,
  getPerformanceByWorkoutMovement,
  getPerformanceByWorkout
}