const Performance = require('../models/performance_model')


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
  let tempPerformanceSum = 0
  for (let property in performance) {
    if(performance[property] > 0 && (property == 'kg' || property == 'rep' || property == 'meter' || property == 'cal' || property == 'sec')) tempPerformanceSum += performance[property]
    if(performance[property] < 0 || performance[property] === '0') return res.status(400).json({error: 'Kg, rep, meter, cal, or sec must > 0'})
    if(!performance[property])performance[property]=null
  }
  if(tempPerformanceSum == 0) return res.status(400).json({error: 'At least one of the measures (Kg, rep, meter, cal, or sec) should > 0'})
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

    if(performance[property] > 0 && (property == 'kg' || property == 'rep' || property == 'meter' || property == 'cal' || property == 'sec')) 
      tempPerformanceSum += performance[property]

    if(performance[property] < 0 || performance[property] === '0') 
      return res.status(400).json({error: 'Round, extra rep, minute, extra sec, kg, rep, meter, cal, or sec must > 0 or leave empty'})
      
    if(!performance[property])performance[property]=null
  }
  if(tempWorkoutSum == 0) return res.status(400).json({error: 'At least one of the measures (Round, extra rep, minute, or extra sec) should > 0'})
  if(tempPerformanceSum == 0) return res.status(400).json({error: 'At least one of the measures (Kg, rep, meter, cal, or sec) should > 0'})
  let result = await Performance.createPerformacne(performance)
  res.json(result)
}

const getPerformancesByCourseUser = async (req, res) => {
  let course_id = req.query.course_id
  let user_id = req.query.user_id
  let result = await Performance.getPerformancesByCourseUser(course_id, user_id)
  res.json(result)
}

const getLeaderboardByWorkout = async (req, res) => {
  let workout_id = req.params.workout_id
  let arr = await Performance.getLeaderboardByWorkout(workout_id)
  let obj = {}

  for (let item of arr) {
    let identifier = `${item.course_id} ${item.user_id}`
    obj[identifier]={
      round_ratio: item.round_ratio ? item.round_ratio : obj[identifier]?.round_ratio,
      minute_ratio: item.minute_ratio ? item.minute_ratio : obj[identifier]?.minute,
      kg_ratio: item.kg_ratio ? item.kg_ratio : obj[identifier]?.kg,
      rep_ratio: item.rep_ratio ? item.rep_ratio : obj[identifier]?.rep_ratio,
      meter_ratio: item.meter_ratio ? item.meter_ratio : obj[identifier]?.meter_ratio,
      cal_ration: item.cal_ration ? item.cal_ration : obj[identifier]?.cal_ration
    }
  }

  let courseUserArr = []
  for (let property in obj) {
    let course_id = property.substring(0, property.indexOf(' '))
    let user_id = property.substring(property.indexOf(' ') + 1)
    
    let courseUser = obj[property]
    let rate = 1
    for (let ratioProperty in courseUser) {
      if(courseUser[ratioProperty]) rate *= parseFloat(courseUser[ratioProperty])
    }

    courseUserArr.push({
      course_id, 
      user_id,
      rate
    })
  }

  courseUserArr.sort((a, b)=>b.rate - a.rate)

  res.json(courseUserArr)
}


const getLeaderboardByWorkouts = async (req, res) => {
  let workout_ids = req.query.workout_ids
  if (typeof workout_ids === 'string') {
    workout_ids = [workout_ids]
  }
  
  let leaderboardArr = []
  for (let id of workout_ids) {
    let workout = await Performance.getWorkout(id)
    let arr = await Performance.getLeaderboardByWorkout(id)
    let obj = {}
    for (let item of arr) {
      let identifier = `${item.course_id} ${item.user_id}`
      obj[identifier]={
        round_ratio: obj[identifier]?.round_ratio ? Math.min(obj[identifier].round_ratio, item.round_ratio) : item.round_ratio,
        minute_ratio: obj[identifier]?.minute_ratio ? Math.min(obj[identifier].minute_ratio, item.minute_ratio) : item.minute_ratio,
        kg_ratio: obj[identifier]?.kg_ratio ? Math.min(obj[identifier].kg_ratio, item.kg_ratio) : item.kg_ratio,
        rep_ratio: obj[identifier]?.rep_ratio ? Math.min(obj[identifier].rep_ratio, item.rep_ratio): item.rep_ratio ,
        meter_ratio: obj[identifier]?.meter_ratio ? Math.min(obj[identifier].meter_ratio, item.meter_ratio) : item.meter_ratio ,
        cal_ration: obj[identifier]?.cal_ration ? Math.min(obj[identifier].cal_ration, item.cal_ration) : item.cal_ration 
        // round_ratio: item.round_ratio ? item.round_ratio : obj[identifier]?.round_ratio,
        // minute_ratio: item.minute_ratio ? item.minute_ratio : obj[identifier]?.minute,
        // kg_ratio: item.kg_ratio ? item.kg_ratio : 1,
        // rep_ratio: item.rep_ratio ? item.rep_ratio : 1,
        // meter_ratio: item.meter_ratio ? item.meter_ratio : 1,
        // cal_ration: item.cal_ration ? item.cal_ration : 1
        // kg_ratio: item.kg_ratio ? Math.pow(item.kg_ratio * obj[identifier]?.kg_ratio, 0.5) : 1, // obj[identifier]?.kg_ratio,
        // rep_ratio: item.rep_ratio ? Math.pow(item.rep_ratio * obj[identifier]?.rep_ratio, 0.5) : 1, // obj[identifier]?.rep_ratio,
        // meter_ratio: item.meter_ratio ? Math.pow(item.meter_ratio * obj[identifier]?.meter_ratio, 0.5) : 1, // obj[identifier]?.meter_ratio,
        // cal_ration: item.cal_ration ? Math.pow(item.cal_ration * obj[identifier]?.cal_ration, 0.5) : 1, // obj[identifier]?.cal_ration
        // kg_ratio: item.kg_ratio ? item.kg_ratio : obj[identifier]?.kg_ratio,
        // rep_ratio: item.rep_ratio ? item.rep_ratio : obj[identifier]?.rep_ratio,
        // meter_ratio: item.meter_ratio ? item.meter_ratio : obj[identifier]?.meter_ratio,
        // cal_ration: item.cal_ration ? item.cal_ration : obj[identifier]?.cal_ration
      }
    }
  
    let courseUserArr = []
    for (let property in obj) {
      let course_id = property.substring(0, property.indexOf(' '))
      let user_id = property.substring(property.indexOf(' ') + 1)
      
      let courseUser = obj[property]
      let rate = 1
      for (let ratioProperty in courseUser) {
        if(courseUser[ratioProperty]) rate *= parseFloat(courseUser[ratioProperty])
      }
  
      courseUserArr.push({
        workout_id: id,
        course_id, 
        user_id,
        rate
      })
    }
  
    courseUserArr.sort((a, b)=>b.rate - a.rate)

    workout.leaders = courseUserArr

    leaderboardArr.push(workout)
  }

  res.json(leaderboardArr)
}

const getLeader = async (req, res) => {
  let course_id = req.query.course_id
  let user_id = req.query.user_id
  let workout_id = req.query.workout_id 
  let result = await Performance.getLeader(course_id, user_id, workout_id)

  res.json(result)
}

module.exports = {
  createPerformance,
  getPerformancesByCourseUser,
  deletePerformance,
  updatePerformance,
  getPerformanceWithMovementWorkoutName,
  getPerformanceByUserMovement,
  getPerformanceByMovement,
  getLeaderboardByWorkout,
  getLeaderboardByWorkouts,
  getLeader
}