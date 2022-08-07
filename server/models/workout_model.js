const { pool } = require("./mysql_conn");
const RestructureUtils = require("../../utils/data_restructure_util")

const selectWorkoutsWithMovementsSQL = `
  select 
    workouts.*,
    workout_movement.id as workout_movement_id,
    workout_movement.movement_id, 
    workout_movement.workout_id,
    workout_movement.kg, 
    workout_movement.cal, 
    workout_movement.rep, 
    workout_movement.meter,
    movements.name as movement_name,
    movements.demo_link
  from workouts 
  left join workout_movement 
  on workouts.id = workout_movement.workout_id
  left join movements 
  on workout_movement.movement_id = movements.id
`;

const getDistinctWorkoutMovements = async (workout_id) => {
  const [result] = await pool.query(
    `
    select 
      distinct workout_movement.movement_id,
      movements.*
    from workout_movement
    left join movements on workout_movement.movement_id = movements.id
    where workout_movement.workout_id =  ?
  `,
    [workout_id]
  );
  return result;
};

const getWorkoutMovements = async (workout_id) => {
  const [result] = await pool.query(
    `
    select 
      workout_movement.*,
      movements.name
    from workout_movement
    left join movements on workout_movement.movement_id = movements.id
    where workout_movement.workout_id = ?
  `,
    [workout_id]
  );
  return result;
};

const updateOnlyWorkout = async (updatedWorkout) => {
  const [result] = await pool.query(
    `
      UPDATE workouts 
      SET ? 
      WHERE id = ?
    `,
    [updatedWorkout, updatedWorkout.id]
  );
  return result;
};

const addWorkoutMovement = async (newWorkoutMovement) => {
  const [result] = await pool.query(`insert into workout_movement SET ? `, [newWorkoutMovement]);
  return result;
};

const getWorkout = async (workout_id) => {
  const [workoutWithMovements] = await pool.query(
    `
    ${selectWorkoutsWithMovementsSQL}
    where workouts.id = ?
  `,
    [workout_id]
  );
  return RestructureUtils.convertToObjWithWorkoutIdAsKey(workoutWithMovements);
};

const deleteWorkoutMovement = async (workout_movement_id) => {
  const [result] = await pool.query(
    `
    delete from workout_movement where id = ?
  `,
    [workout_movement_id]
  );
  return result;
};

const updateWorkoutMovement = async (workoutMovement) => {
  const result = await pool.query(
    `
    UPDATE workout_movement 
    SET ? 
    WHERE id = ?
  `,
    [workoutMovement, workoutMovement.id]
  );

  return result;
};

const getWorkoutMovement = async (workout_movement_id) => {
  const [result] = await pool.query(
    `
    select 
      workout_movement.*,
      movements.name 
    from workout_movement
    left join movements on workout_movement.movement_id = movements.id
    where workout_movement.id = ?
  `,
    [workout_movement_id]
  );

  return result;
};

const createWorkoutWithMovements = async (workout) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("START TRANSACTION");

    const movementArr = workout.movementArr;

    // INSERT new workout and GET new workout_id
    delete workout.movementArr;
    const [result] = await conn.query("INSERT INTO workouts SET ?", workout);
    const workout_id = result.insertId;

    const movementsBeToInserted = movementArr.map((movement) => [
      workout_id,
      movement.movement_id,
      movement.kg,
      movement.cal,
      movement.rep,
      movement.meter
    ]);
    await conn.query("INSERT INTO workout_movement (workout_id, movement_id, kg, cal, rep, meter) VALUES ?", [
      movementsBeToInserted
    ]);

    await conn.query("COMMIT");
    return result.insertId;
  } catch (error) {
    await conn.query("ROLLBACK");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const updateWorkout = async (obj) => {
  const [result] = await pool.query(
    `
      UPDATE workouts 
      SET ? 
      WHERE id = ?
    `,
    [obj, obj.id]
  );
  return result;
};

const getWorkouts = async () => {
  const [result] = await pool.query("select * from workouts");
  return result;
};

const getWorkoutsWithMovements = async () => {
  const [workouts] = await pool.query(selectWorkoutsWithMovementsSQL);

  return RestructureUtils.convertToObjWithWorkoutIdAsKey(workouts);
};

const deleteWorkout = async (workout_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("START TRANSACTION");

    const [movementResult] = await conn.query("delete from workout_movement where workout_id =  ? ", [workout_id]);

    const [workoutResult] = await conn.query("delete from workouts where id = ?", [workout_id]);

    await conn.query("COMMIT");
    return { movementResult, workoutResult };
  } catch (error) {
    await conn.query("ROLLBACK");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

module.exports = {
  updateWorkout,
  getWorkouts,
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
