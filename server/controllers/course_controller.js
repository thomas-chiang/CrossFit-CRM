const Course = require('../models/course_model')
const validator = require('validator');

const checkoutMemberById = async (req, res) => {
  let creator_id = req.user.id
  let user_id = req.query.user_id
  let course_id = req.query.course_id
  let enrollment = req.query.enrollment
  if(!course_id || !user_id) return res.status(500).json({error:'Server Error: Please refresh page or reach out to gym'})
  let result = await Course.checkoutMemberById(course_id, user_id, enrollment, creator_id)
  res.json(result)
}

const quitMemberById = async (req, res) => {
  let creator_id = req.user.id
  let user_id = req.query.user_id
  let course_id = req.query.course_id
  let enrollment = req.query.enrollment
  if(!course_id || !user_id) return res.status(500).json({error:'Server Error: Please refresh page or reach out to gym'})
  let result = await Course.quitMemberById(course_id, user_id, enrollment, creator_id)
  res.json(result)
}


const enrollMemberByExistingUserId = async (req, res) => {
  let creator_id = req.user.id
  let user_id = req.query.user_id
  let course_id = req.query.course_id
  if(!course_id) return res.status(500).json({error:'Server Error: Please refresh page or reach out to IT'})
  let result = await Course.enrollMemberByExistingUserId(course_id, user_id, creator_id)
  res.json(result)
}


const enrollMemberByEmail = async (req, res) => {
  let creator_id = req.user.id
  let email = req.query.email
  let course_id = req.query.course_id
  if(!email) return res.status(400).json({error:'Request Error: email is required.'})
  if(!course_id) return res.status(500).json({error:'Server Error: Please refresh page or reach out to IT'})
  if(!validator.isEmail(email)) return res.status(400).json({error:'Request Error: Invalid email format'})
  let result = await Course.enrollMemberByEmail(course_id, email, creator_id)
  res.json(result)
}

const getCourseEnrolledmembers = async (req, res) => {
  let course_id = req.params.course_id
  let result = await Course.getCourseEnrolledmembers(course_id)
  res.json(result)
}

// const deletePerformance = async (req, res) => {
//   let performance = req.body
//   let result = await Course.deletePerformance(performance)
//   res.json(result)
// }

// const updatePerformance = async (req, res) => {
//   let performance = req.body
//   delete performance.name
//   let result = await Course.updatePerformance(performance)
//   res.json(result)
// }

// const getPerformaces = async (req, res) => {
//   let user_id = req.query.user_id
//   let course_id = req.query.course_id
//   let performances = await Course.getPerformaces(course_id, user_id)
//   res.json(performances)
// }

// const createPerformance = async (req, res) => {
//   let performance = req.body
//   let result = await Course.createPerformance(performance)
//   res.json(result)
// }

const quit = async (req, res) => {
  let id = req.params.id
  let user = req.user
  let result = await Course.quit(id, user)
  res.json(result);
}


const enroll = async (req, res) => {
  let id = req.params.id
  let user = req.user
  let result = await Course.enroll(id, user)
  res.json(result);
}


const createCourse = async (req, res) => {
  const course = req.body
  if(Date.parse(course.start) >= Date.parse(course.end)) return res.status(400).json({error:'start time must be earilier than end time'})
  if(!course.start || !course.end || !course.title || !course.point || course.point <= 0 || !course.size || course.size <= 0) 
    return res.status(400).json({error: 'Course must have start time, end time, point(>0), size(>0), title'})
  
  course.creator_id = req.user.id

  let coaches = course.coaches ? course.coaches : []
  let members = course.members ? course.members : []

  let workouts = course.workouts ? course.workouts : []

  delete course.coaches
  delete course.members
  delete course.workouts

  let result = await Course.createCourse(course, coaches, members, workouts)

  res.json(result);
};

const updateCourse = async (req, res) => {
  const course = req.body
  if(Date.parse(course.start) >= Date.parse(course.end)) return res.status(400).json({error:'start time must be earilier than end time'})
  if(!course.start || !course.end || !course.title || !course.point || course.point <= 0 || !course.size || course.size <= 0) 
    return res.status(400).json({error: 'Course must have start time, end time, point(>0), size(>0), title'})

  let user = req.user
  course.creator_id = user.id

  let coaches = course.coaches ? course.coaches : []

  let workouts = course.workouts ? course.workouts : []

  delete course.coaches
  delete course.members
  delete course.workouts

  let result = await Course.updateCourse(course, coaches, workouts)
  res.json(result);
};

const getCourses = async (req, res) => {
  let obj = await Course.getCourses()

  
  let arr = Object.keys(obj).map(course_id => {

    let course = obj[course_id]
    

    if (course.participants) {
      let participants = Object.keys(course.participants).map(user_id=>
        course.participants[user_id]
      )
      let coaches = []
      let members = []
      for (let participant of participants) {
        participant = {
          ...participant,
          label: participant.name,
          value: participant.id
        }
        //console.log(participant)
        if(participant.role >= 2 && participant.is_coach == 1) coaches.push(participant)
        if(participant.role >= 1 && participant.enrollment !== null) members.push(participant)
      }
      course.members = members.sort((a,b)=>a.enrollment - b.enrollment)
      let enrolledMembers = []
      for (let member of members) {
        if(member.enrollment >= 1) enrolledMembers.push(member)
      }
      
      course.size_enrolled = enrolledMembers.length
      course.coaches = coaches
    } else course.size_enrolled = 0
    

    if (course.workouts) {
      let workouts = Object.keys(course.workouts).map(workout_id=>
        course.workouts[workout_id]
      )
      for (let workout of workouts) {
        workout.label = workout.name
        workout.value = workout.id
      }
      course.workouts = workouts
    }
    

    return obj[course_id]
  })

  res.json(arr)
}

const deleteCourse = async (req, res) => {
  let id = req.params.id
  let result = await Course.deleteCourse(id)
  res.json(result)
}

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  enroll,
  quit,
  // createPerformance,
  // getPerformaces,
  // updatePerformance,
  // deletePerformance,
  getCourseEnrolledmembers,
  enrollMemberByEmail,
  quitMemberById,
  checkoutMemberById,
  enrollMemberByExistingUserId
}