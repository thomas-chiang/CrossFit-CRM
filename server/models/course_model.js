const { pool } = require('./mysql_conn');

const checkoutMemberById = async (course_id, user_id, enrollment, creator_id) => {
  const conn = await pool.getConnection()
  try{
    await conn.query('start transaction')

    let [result] = await conn.query(`update course_user set checkout = 1 where course_id = ? and user_id = ?`, [course_id, user_id])

    let [course_result] = await conn.query(`select * from courses where id = ?`,[course_id])
    let course_point = course_result[0].point

    
    if (enrollment == 1){
      let pointObj = {
        course_id: course_id,
        point: - course_point,
        point_to_be_deducted: - course_point,
        user_id: user_id,
        creator_id: creator_id,
        time: new Date()
      }
      await conn.query('insert into points set ?', [pointObj])

    } else {
      let pointObj = {
        course_id: course_id,
        point: - course_point,
        user_id: user_id,
        creator_id: creator_id,
        time: new Date()
      }
      await conn.query('insert into points set ?', [pointObj])
    }
    
    await conn.query('commit')
    return result
  }catch(error){
    await conn.query('rollback')
    console.log(error)
    throw error
  }finally{
    await conn.release()
  }
}


const quitMemberById = async (course_id, user_id, enrollment, creator_id) => {
  const conn = await pool.getConnection()
  try{
    await conn.query('start transaction')

    let [result] = await conn.query(`update course_user set enrollment = 0 where course_id = ? and user_id = ?`, [course_id, user_id])

    if (enrollment == 1){
      let [course_result] = await conn.query(`select * from courses where id = ?`,[course_id])
      let course_point = course_result[0].point

      // deduct point_to_be_deducted
      let pointObj = {
        course_id: course_id,
        point_to_be_deducted: - course_point,
        user_id: user_id,
        creator_id: creator_id,
        time: new Date()
      }
      await conn.query('insert into points set ?', [pointObj])

/* 
      // check if there is next user
      let [next_users_result] = await conn.query(` 
        select 
          course_user.user_id 
        from course_user 
        left join (
          select 
            user_id, 
            IFNULL(sum(point),0) as point, 
            IFNULL(sum(point_to_be_deducted),0) as point_to_be_deducted
          from points
          group by user_id
        ) sum_points on sum_points.user_id = course_user.user_id
        where course_user.enrollment > 1 
        and course_user.course_id = ?
        and sum_points.point - sum_points.point_to_be_deducted > ? 
        order by course_user.enrollment asc
      `, [course_id, course_point]) 

      // next user existed
      if(next_users_result.length > 0) {  
        let next_user_id = next_users_result[0].user_id

        let pointObj = {
          course_id: course_id,
          point_to_be_deducted: course_point,
          user_id: next_user_id,
          creator_id: creator_id,
        }
        
        await conn.query('update course_user set enrollment = 1 where course_id = ? and user_id = ?', [id, next_user_id])
        await conn.query('insert into points set ?', [pointObj])
      }
 */

    }
    
    await conn.query('commit')
    return result
  }catch(error){
    await conn.query('rollback')
    console.log(error)
    throw error
  }finally{
    await conn.release()
  }
}

const enrollMemberByExistingUserId  = async (course_id, user_id, creator_id) => {
  const conn = await pool.getConnection()
  try{
    await conn.query('start transaction')

    // check point status
    let [points_result] = await conn.query(`
      select
        IFNULL(sum(point),0) as point, 
        IFNULL(sum(point_to_be_deducted),0) as point_to_be_deducted
      from points
      where user_id = ?
    `,[user_id])

    let points_available = points_result[0].point - points_result[0].point_to_be_deducted

    let [course_result] = await conn.query(`select * from courses where id = ?`,[course_id])
    let course_point = course_result[0].point

    // points enough
    if(course_point > points_available) throw {message: 'do not have enough points', status: 400}
    let pointObj = {
      course_id: course_id,
      point_to_be_deducted: course_point,
      user_id: user_id,
      creator_id: creator_id,
      time: new Date()
    }
    await conn.query('insert into points set ?', [pointObj])


    // update enrollment to 1
    let [result] = await conn.query(`
      update course_user set enrollment = 1 where course_id = ? and user_id = ? 
    `,[course_id, user_id])

    await conn.query('commit')
    return result
  }catch(error){
    await conn.query('rollback')
    console.log(error)
    throw error
  }finally{
    await conn.release()
  }
}

const enrollMemberByEmail = async (course_id, email, creator_id) => {
  const conn = await pool.getConnection()
  try{
    await conn.query('start transaction')

    // check user status
    let [user_result] = await conn.query(`select * from users where email = ?`,[email])
    if(user_result.length === 0) throw {message: 'no such email', status: 400}

    let validStatus = user_result[0].valid
    if(validStatus === 0) throw {message: 'Invalid member status', status: 400}
    
    let user_id = user_result[0].id

    let [course_user_result] = await conn.query(`select * from course_user where course_id = ? and user_id = ? and enrollment >= 0`, [course_id, user_id])
    if (course_user_result.length > 0) throw {message: 'Member is already on enrollment list.', status: 400}

    // check point status
    let [points_result] = await conn.query(`
      select
        IFNULL(sum(point),0) as point, 
        IFNULL(sum(point_to_be_deducted),0) as point_to_be_deducted
      from points
      where user_id = ?
    `,[user_id])

    let points_available = points_result[0].point - points_result[0].point_to_be_deducted

    let [course_result] = await conn.query(`select * from courses where id = ?`,[course_id])
    let course_point = course_result[0].point

    // points enough
    if(course_point > points_available) throw {message: 'do not have enough points', status: 400}
    let pointObj = {
      course_id: course_id,
      point_to_be_deducted: course_point,
      user_id: user_id,
      creator_id: creator_id,
      time: new Date()
    }
    await conn.query('insert into points set ?', [pointObj])


    // Check if on the list
    let result
    let [listed_user_result] = await conn.query(`select * from course_user where course_id = ? and user_id = ?`, [course_id, user_id])
    if (listed_user_result.length > 0) {
      result = await conn.query(`
        update course_user set enrollment = 1 where course_id = ? and user_id = ? 
      `,[course_id, user_id])
    } else {
      result = await conn.query(`
        insert into course_user (course_id, user_id, enrollment) values (?, ?, ?)
      `,[course_id, user_id, 1])
    }


    

    await conn.query('commit')
    return result[0]
  }catch(error){
    await conn.query('rollback')
    console.log(error)
    throw error
  }finally{
    await conn.release()
  }
}


const getCourseEnrolledmembers = async (course_id) => {
  const [result] = await pool.query(`
    select 
      users.id,
      users.name,
      course_user.enrollment,
      course_user.checkout
    from course_user
    left join users on course_user.user_id = users.id
    where course_user.enrollment is not null
    and course_user.course_id = ?
  `,[course_id])

  return result
}



const quit = async (id, user) => {
  const conn = await pool.getConnection()
  try {
    await conn.query('start transaction')

    //check if already quit
    let [course_user_result] = await conn.query('select * from course_user where course_id = ? and user_id = ? and enrollment > 0', [id, user.id])
    if(course_user_result.length == 0) throw {message: 'cannot quit without enrollment', status: 400}

    //check if already canceled

    // start lock
    await conn.query('update semaphore set record = record + 1 where course_id = ?', [id])

    // check enrollment status
    let course_user_enrollment = course_user_result[0].enrollment


    // get course points
    let [course_result] = await conn.query(`select * from courses where id = ?`,[id])
    let course_point = course_result[0].point
 
     

    // change enrollment status 
    
    await conn.query('update course_user set enrollment = 0 where course_id = ? and user_id = ?', [id, user.id])
    
    console.log(course_user_enrollment)
    
    // next user
    let next_user_id = 0
    if (course_user_enrollment == 1) { 
      // add back points_to_be_deducted 
      let pointObj = {
        course_id: id,
        point_to_be_deducted: - course_point,
        user_id: user.id,
        creator_id: user.id,
        time: new Date()
      }
      await conn.query('insert into points set ?', [pointObj])
      // check next users with "enough points"
      let [next_users_result] = await conn.query(` 
        select 
          course_user.user_id 
        from course_user 
        left join (
          select 
            user_id, 
            IFNULL(sum(point),0) as point, 
            IFNULL(sum(point_to_be_deducted),0) as point_to_be_deducted
          from points
          group by user_id
        ) sum_points on sum_points.user_id = course_user.user_id
        where course_user.enrollment > 1 
        and course_user.course_id = ?
        and sum_points.point - sum_points.point_to_be_deducted > ? 
        order by course_user.enrollment asc
      `, [id, course_point]) 

      if(next_users_result.length > 0) {  // next user existed
        next_user_id = next_users_result[0].user_id

        let pointObj = {
          course_id: id,
          point_to_be_deducted: course_point,
          user_id: next_user_id,
          creator_id: user.id,
          time: new Date()
        }

        await conn.query('update course_user set enrollment = 1 where course_id = ? and user_id = ?', [id, next_user_id])
        //await conn.query('update users set point_to_be_deducted = point_to_be_deducted + ? where id = ?', [course_point, next_user_id])  // add point to be deducted
        await conn.query('insert into points set ?', [pointObj])
      }
    } 

    await conn.query('commit')
    return next_user_id
  } catch (error) {
    await conn.query('rollback')
    console.log(error)
    throw error
  } finally {
    await conn.release()
  }
}




const enroll = async (id, user) => {
  const conn = await pool.getConnection()
  try {
    await conn.query('start transaction')

    //check if already enrolled
    let [course_user_result] = await conn.query('select * from course_user where course_id = ? and user_id = ?', [id, user.id])
    if(course_user_result.length > 0 && course_user_result[0].enrollment >= 1) throw {message: 'already enrolled', status: 400}

    // start lock semaphore
    await conn.query('update semaphore set record = record + 1 where course_id = ?', [id])

    // check course_point, user_point, user_point_to_be_deducted,  size, and enrolled size 
    let [course_result] = await conn.query(`select * from courses where id = ?`,[id])
    let course_point = course_result[0].point
    let size = course_result[0].size

    let [size_enrolled_result] = await conn.query(
      `
        select course_user.* 
        from course_user 
        left join users on course_user.user_id = users.id
        where course_user.course_id = ? 
        and course_user.enrollment = 1
      `,[id])
    let size_enrolled = size_enrolled_result.length
    

    let [point_result] = await conn.query(`
      select
        IFNULL(sum(point),0) as point, 
        IFNULL(sum(point_to_be_deducted),0) as point_to_be_deducted
      from points
      where user_id = ?
    `,[user.id])
    let user_point = point_result[0].point
    let user_point_to_be_deducted = point_result[0].point_to_be_deducted 

    //check if points are enough
    if(course_point > user_point - user_point_to_be_deducted) throw {message: 'do not have enough points', status: 400}

    
    //check if user who enrolled and quit 
    let enrollButQuit_user_id = 0
    if (course_user_result.length > 0) enrollButQuit_user_id = course_user_result[0].user_id 



    let result = null
    let pointObj = {
      course_id: id,
      point_to_be_deducted: course_point,
      user_id: user.id,
      creator_id: user.id,
      time: new Date()
    }
    if(size_enrolled < size) { 
      // having avaliable spots
      if(enrollButQuit_user_id == 0) {
        // user did not quit the course in the past
        result = await conn.query('INSERT INTO course_user (course_id, user_id, enrollment) VALUES (?, ?, ?)', [id, user.id, 1]);
        await conn.query('insert into points set ?', [pointObj]) // add point to be deducted
      }
      else {
        // user did enrolled but quit in the past
        result = await conn.query('update course_user set enrollment = 1 where course_id = ? and user_id = ?', [id, enrollButQuit_user_id]);
        await conn.query('insert into points set ?', [pointObj]) // add point to be deducted
      }
    } else { 
      // no avaliable spot
      if(enrollButQuit_user_id == 0) result = await conn.query('INSERT INTO course_user (course_id, user_id, enrollment) VALUES (?, ?, ?)', [id, user.id, new Date().getTime()]); // user did not enrolled in the past
      else result = await conn.query('update course_user set enrollment = ? where course_id = ? and user_id = ?', [new Date().getTime(), id, enrollButQuit_user_id]);// user did enrolled but quit in the past      
    }

    await conn.query('commit')
    return result
  } catch (error) {
    await conn.query('rollback')
    console.log(error)
    throw error
  } finally {
    await conn.release()
  }
}

const createCourse = async (course, coaches, members, workouts) => {
  const conn = await pool.getConnection()
  try {
    await conn.query('start transaction')
    const [result] = await conn.query('INSERT INTO courses SET ?', [course]);
    
    let course_id = result.insertId

    await conn.query('INSERT INTO semaphore (course_id) VALUES (?)', [course_id])


    let size = course.size

    if (coaches.length > 0) {
      for (let [index, coach] of coaches.entries()) {
        coaches[index] = [course_id, coach.id, 1]
      }
      await conn.query('INSERT INTO course_user (course_id, user_id, is_coach) VALUES ?', [coaches]);
    }

    

    if (members.length > 0) {
      for (let [index, member] of members.entries()) {
        let enrollment = 1
        if (index >= size) enrollment = 0
        members[index] = [course_id, member.id, enrollment]
      }
      await conn.query('INSERT INTO course_user (course_id, user_id, enrollment) VALUES ?', [members]);
    }
    
    if (workouts.length > 0) {
      for (let [index, workout] of workouts.entries()) {
        workouts[index] = [course_id, workout.id]
      }
      await conn.query('INSERT INTO course_workout (course_id, workout_id) VALUES ?', [workouts]);
    }
    
    await conn.query('commit')
    return result
  } catch (error) {
    await conn.query('rollback')
    console.log(error)
    throw error
  } finally {
    await conn.release()
  }
}

const updateCourse = async (course, coaches, workouts) => {
  const conn = await pool.getConnection()
  try{
    await conn.query('start transaction')

    let course_id = course.id

    // start lock
    await conn.query('update semaphore set record = record + 1 where course_id = ?', [course_id])

    // check if can update point or size
    let [original_enrolled] = await conn.query(`select * from course_user where course_id = ? and enrollment = 1`, [course_id])
    let [original_waiting] = await conn.query(`select * from course_user where course_id = ? and enrollment > 1`, [course_id])

    let [course_result] = await conn.query(`select * from courses where id = ?`,[course_id])
    let original_point = course_result[0].point
    let original_size =  course_result[0].size

    if (original_enrolled.length > 0 && course.point != original_point) throw {message: 'You cannot update point when users have enrolled this course', status: 400}
    if (original_waiting.length > 0 && course.size > original_size) throw {message: 'You cannot increase size when there are users waiting for this course', status: 400}
    if (original_enrolled.length > 0 && course.size < original_size) throw {message: 'You cannot decrease size when there are users enrolled for this course', status: 400}


    // update course
    let [result] = await conn.query(`UPDATE courses SET ? WHERE id = ? `, [course, course_id])


    // set all course users' is_coach = 0
    await conn.query(`update course_user set is_coach = 0 where course_id = ?`, [course_id])

    let [original_users] = await conn.query(`select * from course_user where course_id = ? `, [course_id])
    let original_user_ids = []
    for ( let item of original_users) {
      original_user_ids.push(item.user_id)
    }

    for (let coach of coaches) {
      if (original_user_ids.includes(coach.id)) await conn.query(`update course_user set is_coach = 1 where course_id = ? and user_id = ?`, [course_id, coach.id])
      else await conn.query('INSERT INTO course_user set is_coach = 1, course_id = ?, user_id = ? ', [course_id, coach.id])
    }

    


    // delete and readd workouts
    await conn.query(`delete from course_workout where course_id = ?`, [course_id])    
    if (workouts.length > 0) {
      for (let [index, workout] of workouts.entries()) {
        workouts[index] = [course_id, workout.id]
      }
      await conn.query('INSERT INTO course_workout (course_id, workout_id) VALUES ?', [workouts]);
    }

    
    await conn.query('commit')
    return result
  }catch(error){
    await conn.query('rollback')
    console.log(error)
    throw error
  }finally{
    await conn.release()
  }
};

const getCourses = async () => {
    
  let [results] = await pool.query(`
    select 
      courses.*, 
      users.role, 
      users.id as user_id, 
      users.name as user_name, 
      workouts.id as workout_id, 
      workouts.name as workout_name,
      workouts.round as workout_round,
      workouts.extra_count as workout_extra_count,
      workouts.minute as workout_minute,
      workouts.extra_sec as workout_extra_sec,
      workouts.note as workout_note,
      course_user.enrollment as enrollment,
      course_user.is_coach
    from courses 
    left join course_user on courses.id = course_user.course_id
    left join users on course_user.user_id = users.id 
    left join course_workout on courses.id = course_workout.course_id
    left join workouts on course_workout.workout_id = workouts.id
  `)
  
  let obj = {}

  for (let item of results) {
    if (obj[item.id]) {
      if (item.user_id) {
        obj[item.id].participants = {
          ...obj[item.id].participants,
          [item.user_id]:{
            id: item.user_id,
            role: item.role,
            name: item.user_name,
            enrollment: item.enrollment,
            is_coach: item.is_coach
          }
        }
      }
      if (item.workout_id) {
        obj[item.id].workouts = {
          ...obj[item.id].workouts,
          [item.workout_id]:{
            id: item.workout_id,
            name: item.workout_name,
            round: item.workout_round,
            extra_count: item.workout_extra_count,
            minute: item.workout_minute,
            extra_sec: item.workout_extra_sec,
            note: item.workout_note
          }
        }
      }
    } else {
      obj[item.id] = {
        id: item.id,
        creator_id: item.creator_id,
        // gym_id: item.gym_id,
        // gym_name: item.gym_name,
        // gym: {
        //   id: item.gym_id,
        //   label: item.gym_name,
        //   value: item.gym_id,
        //   name: item.gym_name
        // },
        title: item.title,
        size: item.size,
        start: item.start,
        end: item.end,
        note: item.note,
        point: item.point      
      }
      if (item.user_id) {
        obj[item.id] = {
          ...obj[item.id],
          participants: {
            [item.user_id]:{
              id: item.user_id,
              role: item.role,
              name: item.user_name,
              enrollment: item.enrollment,
              is_coach: item.is_coach
            }
          }
        }
      }
      if (item.workout_id) {
        obj[item.id] = {
          ...obj[item.id],
          workouts: {
            [item.workout_id]:{
              id: item.workout_id,
              name: item.workout_name,
              round: item.workout_round,
              extra_count: item.workout_extra_count,
              minute: item.workout_minute,
              extra_sec: item.workout_extra_sec,
              note: item.workout_note
            }
          }
        }
      }
    }
  }
  return obj
}

const deleteCourse = async (id) => {
  const conn = await pool.getConnection()
  try{
    await conn.query('start transaction')

    //await conn.query(`delete from course_user where course_id = ?`, [id])
    await conn.query(`delete from course_workout where course_id = ?`, [id])
    await conn.query(`delete from performances where course_id = ?`, [id])
    let result = await conn.query(`delete from courses where id = ?`, [id])

    await conn.query('commit')
    return result
  }catch(error){
    await conn.query('rollback')
    console.log(error)
    throw error
  }finally{
    await conn.release()
  }
};

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