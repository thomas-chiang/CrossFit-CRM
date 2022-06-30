const { pool } = require('./mysql_conn');

const getPerformanceByUserMovement = async (user_id, movement_id)=> {
  const [result] = await pool.query(`
    SELECT 
      performances.kg,
      performances.rep,
      performances.meter,
      performances.cal,
      performances.sec,
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

const createPerformacne = async (performacne) => {
  const [result] = await pool.query('INSERT INTO performances SET ?', [performacne]);
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



module.exports = {
  createPerformacne,
  getPerformacnes,
  updatePerformance,
  deletePerformance,
  getPerformancesByCourseUser,
  getPerformanceWithMovementWorkoutName,
  getPerformanceByUserMovement
};