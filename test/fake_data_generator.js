require("dotenv").config();
const { NODE_ENV } = process.env;
const bcrypt = require("bcrypt");
const { users, courses, movements, workouts, performance } = require("./fake_data");
const { pool } = require("../server/models/mysql_conn");
const salt = parseInt(process.env.BCRYPT_SALT);

async function _createFakeUser(conn) {
  const encryped_users = users.map((user) => {
    const encryped_user = {
      role: user.role,
      email: user.email,
      password: user.password ? bcrypt.hashSync(user.password, salt) : null,
      name: user.name,
      gender: user.gender,
      valid: user.valid
    };
    return encryped_user;
  });
  await conn.query("INSERT INTO users (role, email, password, name, gender, valid) VALUES ?", [
    encryped_users.map((x) => Object.values(x))
  ]);
}

async function _createPoint(conn) {
  let [owner_ids] = await conn.query("select id from users where role = 2");
  let first_owner_id = owner_ids[0].id;

  let [member_ids] = await conn.query("select id from users where role = 1");
  member_ids.forEach((member) => {
    member.creator_id = first_owner_id;
    member.point = 10;
    member.time = new Date();
  });

  await conn.query("INSERT INTO points (user_id, creator_id, point, time) VALUES ?", [member_ids.map((x) => Object.values(x))]);
}

async function _createFakeCourse(conn) {
  await conn.query("INSERT INTO courses (title, size, start, end, note, point) VALUES ?", [courses.map((x) => Object.values(x))]);
  let [course_ids] = await conn.query("select id from courses");
  await conn.query("INSERT INTO semaphore (course_id) VALUES ?", [course_ids.map((x) => Object.values(x))]);
}

async function _createFakeCourseUser(conn) {
  let [course_ids] = await conn.query("select id from courses");
  let first_course_id = course_ids[0].id;

  let [coach_ids] = await conn.query("select id from users where role = 2");
  let first_coach_id = coach_ids[0].id;

  let [member_ids] = await conn.query("select id from users where role = 1");
  let first_member_id = member_ids[0].id;

  await conn.query("INSERT INTO course_user (course_id, user_id, is_coach) VALUES (?, ?, ?)", [
    first_course_id,
    first_member_id,
    1
  ]);

  await conn.query("INSERT INTO course_user (course_id, user_id, enrollment) VALUES (?, ?, ?)", [
    first_course_id,
    first_coach_id,
    1
  ]);
}

async function _createFakeMovement(conn) {
  let [coach_ids] = await conn.query("select id from users where role = 2");
  let first_coach_id = coach_ids[0].id;

  movements.forEach((movement) => {
    movement.creator_id = first_coach_id;
  });

  await conn.query("INSERT INTO movements (name, demo_link, creator_id) VALUES ? ", [movements.map((x) => Object.values(x))]);
}

async function _createFakeMovement(conn) {
  let [coach_ids] = await conn.query("select id from users where role = 2");
  let first_coach_id = coach_ids[0].id;

  movements.forEach((movement) => (movement.creator_id = first_coach_id));

  await conn.query("INSERT INTO movements (name, demo_link, creator_id) VALUES ? ", [movements.map((x) => Object.values(x))]);
}

async function _createFakeWorkout(conn) {
  let [coach_ids] = await conn.query("select id from users where role = 2");
  let first_coach_id = coach_ids[0].id;

  workouts.forEach((workout) => (workout.creator_id = first_coach_id));

  await conn.query("INSERT INTO workouts (name, round, extra_count, minute, extra_sec, note, creator_id) VALUES ? ", [
    workouts.map((x) => Object.values(x))
  ]);
}

async function _createFakeWorkoutMovement(conn) {
  let [workout_ids] = await conn.query("select id from workouts");
  let first_workout_id = workout_ids[0].id;

  let [movements] = await conn.query("select * from movements");

  movements.forEach((movement) => {
    movement.workout_id = first_workout_id;
    movement.kg = Math.floor(Math.random() * 100);
    movement.rep = Math.floor(Math.random() * 100);
    movement.meter = Math.floor(Math.random() * 100);
    movement.cal = Math.floor(Math.random() * 100);
    delete movement.name;
    delete movement.demo_link;
    delete movement.creator_id;
  });

  await conn.query("INSERT INTO workout_movement (movement_id, workout_id, kg, rep, meter, cal) VALUES ? ", [
    movements.map((x) => Object.values(x))
  ]);
}

async function _createFakeWorkoutMovement(conn) {
  let [workout_ids] = await conn.query("select id from workouts");
  let first_workout_id = workout_ids[0].id;

  let [movements] = await conn.query("select * from movements");

  movements.forEach((movement) => {
    movement.workout_id = first_workout_id;
    movement.kg = Math.floor(Math.random() * 100);
    movement.rep = Math.floor(Math.random() * 100);
    movement.meter = Math.floor(Math.random() * 100);
    movement.cal = Math.floor(Math.random() * 100);
    delete movement.name;
    delete movement.demo_link;
    delete movement.creator_id;
  });

  await conn.query("INSERT INTO workout_movement (movement_id, workout_id, kg, rep, meter, cal) VALUES ? ", [
    movements.map((x) => Object.values(x))
  ]);
}

async function _createFakePerformance(conn) {
  let [course_ids] = await conn.query("select id from courses");
  let first_course_id = course_ids[0].id;

  let [member_ids] = await conn.query("select id from users where role = 1");
  let first_member_id = member_ids[0].id;

  let [workouts] = await conn.query("select * from workouts");
  let first_workout_id = workouts[0].id;
  let first_workout_round = workouts[0].round;
  let first_workout_extra_count = workouts[0].extra_count;
  let first_workout_minute = workouts[0].minute;
  let first_workout_extra_sec = workouts[0].extra_sec;

  let [workoutMovements] = await conn.query(`select * from workout_movement where workout_id = ${first_workout_id}`);

  workoutMovements.forEach((workoutMovement) => {
    workoutMovement.kg = performance.kg;
    workoutMovement.rep = performance.rep;
    workoutMovement.meter = performance.meter;
    workoutMovement.cal = performance.cal;
    workoutMovement.course_id = first_course_id;
    workoutMovement.user_id = first_member_id;
    workoutMovement.round = performance.round;
    workoutMovement.extra_count = performance.extra_count;
    workoutMovement.minute = performance.minute;
    workoutMovement.extra_sec = performance.extra_sec;
  });

  await conn.query(
    "INSERT INTO performances (workout_movement_id, workout_id, movement_id, kg, rep, meter, cal, course_id, user_id, round, extra_count, minute, extra_sec) VALUES ? ",
    [workoutMovements.map((x) => Object.values(x))]
  );
}

async function createFakeData() {
  if (NODE_ENV !== "test") {
    console.log("Not in test env");
    return;
  }
  const conn = await pool.getConnection();
  await conn.query("START TRANSACTION");
  await conn.query("SET FOREIGN_KEY_CHECKS = ?", 0);

  await _createFakeUser(conn);
  await _createPoint(conn);
  await _createFakeCourse(conn);
  await _createFakeCourseUser(conn);
  await _createFakeMovement(conn);
  await _createFakeWorkout(conn);
  await _createFakeWorkoutMovement(conn);
  await _createFakePerformance(conn);

  await conn.query("SET FOREIGN_KEY_CHECKS = ?", 1);
  await conn.query("COMMIT");
  await conn.release();
}

async function truncateFakeData() {
  if (NODE_ENV !== "test") {
    console.log("Not in test env");
    return;
  }

  const truncateTable = async (table) => {
    const conn = await pool.getConnection();
    await conn.query("START TRANSACTION");
    await conn.query("SET FOREIGN_KEY_CHECKS = ?", 0);
    await conn.query(`TRUNCATE TABLE ${table}`);
    await conn.query("SET FOREIGN_KEY_CHECKS = ?", 1);
    await conn.query("COMMIT");
    await conn.release();
    return;
  };

  const tables = [
    "users",
    "courses",
    "course_user",
    "course_workout",
    "movements",
    "performances",
    "points",
    "semaphore",
    "workout_movement",
    "workouts"
  ];
  for (let table of tables) {
    await truncateTable(table);
  }

  return;
}

async function closeConnection() {
  return await pool.end();
}

async function main() {
  await truncateFakeData();
  await createFakeData();
  await closeConnection();
}

// execute when called directly.
if (require.main === module) {
  main();
}

module.exports = {
  createFakeData,
  truncateFakeData,
  closeConnection
};
