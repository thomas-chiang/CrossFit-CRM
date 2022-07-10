const { pool } = require('./mysql_conn');

const getWorkout = async (workout_id) => {
  const [result] = await pool.query('select * from workouts where id = ? ',[workout_id])
  return result[0]
}

const getPerformanceByUserMovement = async (user_id, movement_id)=> {
  const [result] = await pool.query(`
    SELECT 
      performances.kg,
      performances.rep,
      performances.meter,
      performances.cal,
      performances.round,
      performances.minute,
      performances.extra_count,
      performances.extra_sec,
      courses.start,
      workouts.name as workout_name
    FROM performances
    left join courses on performances.course_id = courses.id
    left join workouts on performances.workout_id = workouts.id
    where performances.user_id = ?
    and performances.movement_id = ?
    ORDER BY courses.start ASC
  `,[user_id, movement_id])

  return result
}

const getPerformanceWithMovementWorkoutName = async (performance_id) => {
  const [result] = await pool.query(`
    select 
      performances.*,
      movements.name,
      workouts.name as workout_name
    from performances
    left join movements on performances.movement_id = movements.id
    left join workouts on performances.workout_id = workouts.id
    where performances.id = ? 
  `, [performance_id])

  return result
}

const createPerformacne = async (performance) => {
  const [result] = await pool.query('INSERT INTO performances SET ?', [performance]);
  return result;
};

const getPerformancesByCourseUser = async(course_id, user_id) => {
  
  const [performances] = await pool.query(`
    select 
      performances.*,
      movements.name,
      workouts.name as workout_name
    from performances
    left join movements on performances.movement_id = movements.id
    left join workouts on performances.workout_id = workouts.id
    where performances.course_id = ? 
    and performances.user_id = ?
  `, [course_id, user_id])

  return performances
}

const updatePerformance = async (performance) => {
  const [result] = await pool.query(
    `
      UPDATE performances 
      SET ? 
      WHERE id = ?
    `, [performance, performance.id]);
  return result;
};

const getPerformacnes = async () => {
  const [result] = await pool.query('select * from performacnes');
  return result
};

const deletePerformance = async (performance) => {
  const [result] = await pool.query('delete from performances where id = ?',[performance.id]);
  return result
};

const getLeaderboardByWorkout = async (workout_id, movementsLength) => {
  const [result] = await pool.query(`
  SELECT
      performances.id,
      performances.course_id,
      performances.user_id,
      users.name,
      IFNULL((performances.round + performances.extra_count / workout_total_count.total_count) / workouts.round, 1) as round_m, 
      IFNULL(workouts.minute / (performances.minute + performances.extra_sec / 60), 1) as minute_m,
      IFNULL(performances.kg / workout_movement.kg, 1) as kg_m,
      IFNULL(performances.rep / workout_movement.rep, 1) as rep_m,
      IFNULL(performances.meter / workout_movement.meter, 1) as meter_m,
      IFNULL(performances.cal / workout_movement.cal, 1) as cal_m,
      IFNULL(performances.kg / workout_movement.kg, 1) 
      * IFNULL(performances.rep / workout_movement.rep, 1) 
      * IFNULL(performances.meter / workout_movement.meter, 1) 
      * IFNULL(performances.cal / workout_movement.cal, 1) as ratio
    FROM performances
    left join workout_movement on performances.workout_movement_id = workout_movement.id
    left join workouts on performances.workout_id = workouts.id
    left join (
      select 
        workout_id,IFNULL(sum(kg), 0)+IFNULL(sum(rep), 0)+IFNULL(sum(meter), 0)+IFNULL(sum(cal), 0) as total_count
      from workout_movement
      group by workout_id
    ) workout_total_count on performances.workout_id = workout_total_count.workout_id
    left join users on performances.user_id = users.id
    where performances.workout_id = ?
    limit ?
  `,[workout_id, movementsLength*10]);
  return result
}

const getLeader = async (course_id, user_id, workout_id) => {
  const [result] = await pool.query(`
    select 
      performances.*,
      users.name as user_name,
      movements.name as movement_name,
      workouts.name as workout_name,
      courses.start,
      courses.end
    from performances
    left join users on performances.user_id = users.id
    left join movements on performances.movement_id = movements.id
    left join workouts on performances.workout_id = workouts.id
    left join courses on performances.course_id = courses.id
    where performances.user_id = ?
    and performances.course_id = ?
    and performances.workout_id = ?
  `,[user_id, course_id, workout_id]);

  return result
}

module.exports = {
  createPerformacne,
  getPerformacnes,
  updatePerformance,
  deletePerformance,
  getPerformancesByCourseUser,
  getPerformanceWithMovementWorkoutName,
  getPerformanceByUserMovement,
  getLeaderboardByWorkout,
  getWorkout,
  getLeader
};