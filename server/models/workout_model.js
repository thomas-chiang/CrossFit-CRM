const { pool } = require('./mysql_conn')

const getWorkoutMovements = async (workout_id) => {
  const [result] = await pool.query(`
    select 
      workout_movement.*,
      movements.name
    from workout_movement
    left join movements on workout_movement.movement_id = movements.id
    where workout_movement.workout_id = ?
  `,[workout_id])
  return result;
}

const updateOnlyWorkout = async (updatedWorkout) => {
  const [result] = await pool.query(
    `
      UPDATE workouts 
      SET ? 
      WHERE id = ?
    `, [updatedWorkout, updatedWorkout.id]);
  return result;
}

const addWorkoutMovement = async (newWorkoutMovement) => {
  let [result] = await pool.query(`insert into workout_movement SET ? `,[newWorkoutMovement]) 
  return result 
}

const getWorkout = async (workout_id) => {   // movement issues
  const [workoutWithMovements] = await pool.query(`
    select 
      workouts.*,
      workout_movement.id as workout_movement_id,
      workout_movement.movement_id, 
      workout_movement.workout_id,
      workout_movement.kg, 
      workout_movement.cal, 
      workout_movement.rep, 
      workout_movement.meter,
       
      movements.name as movement_name
    from workouts 
    left join workout_movement 
    on workouts.id = workout_movement.workout_id
    left join movements 
    on workout_movement.movement_id = movements.id
    where workouts.id = ?
  `,[workout_id])

  let obj = {}
  for (item of workoutWithMovements) {
    let movementObj = {
      id: item.workout_movement_id,
      movement_id: item.movement_id,
      workout_id: item.workout_id,
      name: item.movement_name,
      kg: item.kg,
      cal: item.cal,
      rep: item.rep,
      meter: item.meter,
      //sec: item.sec
    }

    if(obj[item.id]){
      obj[item.id].movements.push(movementObj)
    } else {
      obj[item.id] = {
        id: item.id,
        name: item.name,
        round: item.round,
        extra_count: item.extra_count,
        minute: item.minute,
        extra_sec: item.extra_sec,
        note: item.note,
        demo_link: item.demo_link,
        creator_id: item.creator_id,
        movements: [movementObj]
      }
    } 

    if(!obj[item.id].movements[0].id) delete obj[item.id].movements
  }
  return obj
}

const deleteWorkoutMovement = async(workout_movement_id)=> {
  let [result] = await pool.query(`
    delete from workout_movement where id = ?
  `, [workout_movement_id])
  return result
}

const updateWorkoutMovement = async(workoutMovement) => {
  const result = await pool.query(`
    UPDATE workout_movement 
    SET ? 
    WHERE id = ?
  `,[workoutMovement, workoutMovement.id])

  return result
}

const getWorkoutMovement = async (workout_movement_id) => {
  let [result] = await pool.query(`
    select 
      workout_movement.*,
      movements.name 
    from workout_movement
    left join movements on workout_movement.movement_id = movements.id
    where workout_movement.id = ?
  `, [workout_movement_id])

  return result
}

const createWorkoutWithMovement = async (workout) => {
  const conn = await pool.getConnection();
  try {
      await conn.query('START TRANSACTION');

      let movementArr = workout.movementArr
      
      delete workout.movementArr

      const [result] = await conn.query('INSERT INTO workouts SET ?', workout);

      let movements = []
      let workout_id = result.insertId
      for (let item of movementArr) {
        movements.push([
          workout_id,
          item.movement_id,
          item.kg,
          item.cal,
          item.rep,
          item.meter,
          //item.sec
        ])
      }
      
      await conn.query('INSERT INTO workout_movement (workout_id, movement_id, kg, cal, rep, meter) VALUES ?', [movements]);
      await conn.query('COMMIT');
      return result.insertId;
  } catch (error) {
      await conn.query('ROLLBACK');
      console.log(error)
      throw error;
  } finally {
      await conn.release();
  }
};

// const createWorkout = async (obj) => {
//   const [result] = await pool.query('INSERT INTO workouts SET ?', [obj])
//   return result;
// };

const updateWorkout = async (obj) => {
  const [result] = await pool.query(
    `
      UPDATE workouts 
      SET ? 
      WHERE id = ?
    `, [obj, obj.id]);
  return result;
};

const getWorkouts = async () => {
  const [result] = await pool.query('select * from workouts')
  return result
}

const getWorkoutsWithMovements = async () => { // movement issues
  const [workouts] = await pool.query(`
  select 
    workouts.*,
    workout_movement.movement_id, 
    workout_movement.kg, 
    workout_movement.cal, 
    workout_movement.rep, 
    workout_movement.meter,
     
    movements.name as movement_name
  from workouts 
  left join workout_movement 
  on workouts.id = workout_movement.workout_id
  left join movements 
  on workout_movement.movement_id = movements.id
  `)
  
  let obj = {}
  for (const workout of workouts) {

    let movementObj = workout.movement_name ? {
      name: workout.movement_name,
      kg: workout.kg,
      cal: workout.cal,
      rep: workout.rep,
      meter: workout.meter,
      // sec: workout.sec
    } : undefined

    if(obj[workout.id]){
      obj[workout.id].movements.push(movementObj)
    } else {
      obj[workout.id] = {
        id: workout.id,
        name: workout.name,
        round: workout.round,
        extra_count: workout.extra_count,
        minute: workout.minute,
        extra_sec: workout.extra_sec,
        note: workout.note,
        demo_link: workout.demo_link,
        creator_id: workout.creator_id,
        movements: movementObj ? [movementObj] : undefined
      }
    }  
  }

  return obj
}

const deleteWorkout = async (workout_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    const [movementResult] = await conn.query('delete from workout_movement where workout_id =  ? ',[workout_id]) 

    const [workoutResult] = await conn.query('delete from workouts where id = ?',[workout_id])

    await conn.query('COMMIT');
    return {movementResult, workoutResult}
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log(error)
    throw error;
  } finally {
    await conn.release();
  }
};

const getOwnedWorkouts = async (user) => {
  const [result] = await pool.query('select * from workouts where creator_id = ?',[user.id])
  return result
}



// const getOwnedWorkoutsWithMovements = async (user) => {  // VS getWorkoutsWithMovements // movement issues
//   const [workouts] = await pool.query(`
//   select 
//     workouts.*,
//     workout_movement.id as workout_movement_id, 
//     workout_movement.movement_id, 
//     workout_movement.kg, 
//     workout_movement.cal, 
//     workout_movement.rep, 
//     workout_movement.meter,
//     workout_movement.sec, 
//     movements.name as movement_name
//   from workouts 
//   left join workout_movement 
//   on workouts.id = workout_movement.workout_id
//   left join movements 
//   on workout_movement.movement_id = movements.id
//   where workouts.creator_id = ?
//   `, [user.id])
  
//   let obj = {}
//   for (const workout of workouts) {

//     let movementObj = {
//         id: workout.workout_movement_id,
//         movement_id: workout.movement_id,
//         workout_id: workout.id,
//         name: workout.movement_name,
//         kg: workout.kg,
//         cal: workout.cal,
//         rep: workout.rep,
//         meter: workout.meter,
//         sec: workout.sec
//       } 


//     if(obj[workout.id]){
//       obj[workout.id].movements.push(movementObj)
//     } else {
//       obj[workout.id] = {
//         id: workout.id,
//         name: workout.name,
//         minute: workout.minute,
//         note: workout.note,
//         demo_link: workout.demo_link,
//         creator_id: workout.creator_id,
//         movements: [movementObj]
//       }
//     }

//     if(!obj[workout.id].movements[0].id) delete obj[workout.id].movements
//   }
//   return obj
// }



const deleteWorkoutWithMovements = async (workout) => {
  const conn = await pool.getConnection();
  let movements = workout.movements
  let movementMovementIds = []
  for (let movement of movements) {
    movementMovementIds.push(movement.workout_movement_id)
  }
  let id = workout.id
  try {
    await conn.query('START TRANSACTION');

    const [movementResult] = await conn.query('delete from workout_movement where id in ( ? )',[movementMovementIds]) 

    const [workoutResult] = await conn.query('delete from workouts where id = ?',[id])

    await conn.query('COMMIT');
    return {movementResult, workoutResult}
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log(error)
    throw error;
  } finally {
    await conn.release();
  }
};




module.exports = {
  // createWorkout,
  updateWorkout,
  getWorkouts,
  deleteWorkout,
  getOwnedWorkouts,
  createWorkoutWithMovement,
  getWorkoutsWithMovements,
  // getOwnedWorkoutsWithMovements,
  deleteWorkoutWithMovements,
  getWorkoutMovement,
  updateWorkoutMovement,
  deleteWorkoutMovement,
  getWorkout,
  addWorkoutMovement,
  updateOnlyWorkout,
  getWorkoutMovements
}