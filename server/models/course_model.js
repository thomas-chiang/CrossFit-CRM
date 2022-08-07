const { pool } = require("./mysql_conn");
const ModelUtils = require("../../utils/model_util");
const Utils = require("../../utils/util");

const removeMemberById = async (course_id, user_id, enrollment, creator_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");

    // start lock
    await conn.query("select id from courses where id = ? for update", [course_id]);

    // add back point_to_be_deducted if enrolled
    if (enrollment == 1) {
      const course_point = await ModelUtils.getCoursePoint(conn, course_id);

      const pointObj = {
        course_id: course_id,
        point_to_be_deducted: -course_point,
        user_id: user_id,
        creator_id: creator_id,
        time: new Date()
      };

      await conn.query("insert into points set ?", [pointObj]);
    }

    const [result] = await conn.query(`update course_user set enrollment = null where course_id = ? and user_id = ?`, [
      course_id,
      user_id
    ]);

    await conn.query("commit");
    return result;
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const uncheckoutMemberById = async (course_id, user_id, enrollment, creator_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");

    // start lock
    await conn.query("select id from courses where id = ? for update", [course_id]);

    const [result] = await conn.query(`update course_user set checkout = 0 where course_id = ? and user_id = ?`, [
      course_id,
      user_id
    ]);

    const course_point = await ModelUtils.getCoursePoint(conn, course_id);

    const pointObj = {
      course_id: course_id,
      point: course_point,
      point_to_be_deducted: course_point,
      user_id: user_id,
      creator_id: creator_id,
      time: new Date()
    };
    await conn.query("insert into points set ?", [pointObj]);

    await conn.query("commit");
    return result;
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const checkoutMemberById = async (course_id, user_id, enrollment, creator_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");

    // start lock
    await conn.query("select id from courses where id = ? for update", [course_id]);

    const [result] = await conn.query(`update course_user set checkout = 1 where course_id = ? and user_id = ?`, [
      course_id,
      user_id
    ]);

    const course_point = await ModelUtils.getCoursePoint(conn, course_id);

    const pointObj = {
      course_id: course_id,
      point: -course_point,
      point_to_be_deducted: -course_point,
      user_id: user_id,
      creator_id: creator_id,
      time: new Date()
    };
    await conn.query("insert into points set ?", [pointObj]);

    await conn.query("commit");
    return result;
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const quitMemberById = async (course_id, user_id, enrollment, creator_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");

    // start lock
    await conn.query("select id from courses where id = ? for update", [course_id]);

    const [result] = await conn.query(`update course_user set enrollment = 0 where course_id = ? and user_id = ?`, [
      course_id,
      user_id
    ]);

    const course_point = await ModelUtils.getCoursePoint(conn, course_id);

    // decrease point_to_be_deducted
    const pointObj = {
      course_id: course_id,
      point_to_be_deducted: -course_point,
      user_id: user_id,
      creator_id: creator_id,
      time: new Date()
    };
    await conn.query("insert into points set ?", [pointObj]);

    await conn.query("commit");
    return result;
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const enrollMemberByExistingUserId = async (course_id, user_id, creator_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");

    // start lock
    await conn.query("select id from courses where id = ? for update", [course_id]);

    // check point status
    const points_available = await ModelUtils.getAvailablePointsByUser(conn, user_id);
    const course_point = await ModelUtils.getCoursePoint(conn, course_id);
    if (course_point > points_available) throw { message: "do not have enough points", status: 400 };

    // points enough
    const pointObj = {
      course_id: course_id,
      point_to_be_deducted: course_point,
      user_id: user_id,
      creator_id: creator_id,
      time: new Date()
    };
    await conn.query("insert into points set ?", [pointObj]);

    // update enrollment to 1
    const [result] = await conn.query(` update course_user set enrollment = 1 where course_id = ? and user_id = ? `, [
      course_id,
      user_id
    ]);

    await conn.query("commit");
    return result;
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const enrollMemberByEmail = async (course_id, email, creator_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");

    // check user status
    const [user_result] = await conn.query(`select * from users where email = ?`, [email]);
    if (user_result.length === 0) throw { message: "no such email", status: 400 };
    const user_id = user_result[0].id;

    // start lock
    await conn.query("select id from courses where id = ? for update", [course_id]);

    // check if user on enrollment list
    if (await ModelUtils.isUserOnEnrollmentList(conn, course_id, user_id))
      throw { message: "Member is already on enrollment list.", status: 400 };

    // check point status
    const points_available = await ModelUtils.getAvailablePointsByUser(conn, user_id);
    const course_point = await ModelUtils.getCoursePoint(conn, course_id);
    if (course_point > points_available) throw { message: "The user does not have enough points", status: 400 };

    // record point_to_be_deducted
    const pointObj = {
      course_id: course_id,
      point_to_be_deducted: course_point,
      user_id: user_id,
      creator_id: creator_id,
      time: new Date()
    };
    await conn.query("insert into points set ?", [pointObj]);

    // Check if on the list
    let result;
    if (await ModelUtils.isUserOnCourseList(conn, course_id, user_id)) {
      result = await conn.query(` update course_user set enrollment = 1 where course_id = ? and user_id = ? `, [
        course_id,
        user_id
      ]);
    } else {
      result = await conn.query(` insert into course_user (course_id, user_id, enrollment) values (?, ?, ?) `, [
        course_id,
        user_id,
        1
      ]);
    }

    await conn.query("commit");
    return result[0];
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const getCourseEnrolledmembers = async (course_id) => {
  const [result] = await pool.query(
    `
    select 
      users.id,
      users.name,
      course_user.enrollment,
      course_user.checkout
    from course_user
    left join users on course_user.user_id = users.id
    where course_user.enrollment is not null
    and course_user.course_id = ?
  `,
    [course_id]
  );

  return result;
};

const quit = async (course_id, user_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");

    // start lock
    await conn.query("select id from courses where id = ? for update", [course_id]);

    // check enrollment status
    const course_user_enrollment = await ModelUtils.userEnrollmentStatusOnCourse(conn, course_id, user_id);

    //check if already canceled or not enrolled
    if (!course_user_enrollment) throw { message: "cannot quit without enrollment", status: 400 };

    // get course points
    const course_point = await ModelUtils.getCoursePoint(conn, course_id);

    // change enrollment status
    await conn.query("update course_user set enrollment = 0 where course_id = ? and user_id = ?", [course_id, user_id]);
    let next_user_id; // next user
    if (course_user_enrollment == 1) {
      const pointObj = {
        // add back points_to_be_deducted
        course_id: course_id,
        point_to_be_deducted: -course_point,
        user_id: user_id,
        creator_id: user_id,
        time: new Date()
      };
      await conn.query("insert into points set ?", [pointObj]);

      next_user_id = await ModelUtils.getNextUserId(conn, course_id, course_point);
      if (next_user_id) {
        const pointObj = {
          course_id: course_id,
          point_to_be_deducted: course_point,
          user_id: next_user_id,
          creator_id: user_id,
          time: new Date()
        };
        await conn.query("insert into points set ?", [pointObj]);
        await conn.query("update course_user set enrollment = 1 where course_id = ? and user_id = ?", [course_id, next_user_id]);
      }
    }

    await conn.query("commit");
    return next_user_id;
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const enroll = async (course_id, user_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");

    // start lock
    await conn.query("select id from courses where id = ? for update", [course_id]);

    // check enrollment status
    const course_user_enrollment = await ModelUtils.userEnrollmentStatusOnCourse(conn, course_id, user_id);
    if (course_user_enrollment > 0) throw { message: "already enrolled", status: 400 };

    //check if points are enough
    const course_point = await ModelUtils.getCoursePoint(conn, course_id);
    const available_point = await ModelUtils.getAvailablePointsByUser(conn, user_id);
    if (course_point > available_point) throw { message: "do not have enough points", status: 400 };

    // available spots
    const availableSpots = await ModelUtils.getAvailableSpots(conn, course_id);

    let result;
    if (availableSpots > 0) {
      // having avaliable spots
      const pointObj = {
        course_id: course_id,
        point_to_be_deducted: course_point,
        user_id: user_id,
        creator_id: user_id,
        time: new Date()
      };
      if (!(await ModelUtils.isUserOnCourseList(conn, course_id, user_id))) {
        result = await conn.query("INSERT INTO course_user (course_id, user_id, enrollment) VALUES (?, ?, ?)", [
          course_id,
          user_id,
          1
        ]);
        await conn.query("insert into points set ?", [pointObj]); // add point to be deducted
      } else {
        result = await conn.query("update course_user set enrollment = 1 where course_id = ? and user_id = ?", [
          course_id,
          user_id
        ]);
        await conn.query("insert into points set ?", [pointObj]); // add point to be deducted
      }
    } else {
      // no avaliable spots
      if (!(await ModelUtils.isUserOnCourseList(conn, course_id, user_id)))
        result = await conn.query("INSERT INTO course_user (course_id, user_id, enrollment) VALUES (?, ?, ?)", [
          course_id,
          user_id,
          new Date().getTime()
        ]);
      else
        result = await conn.query("update course_user set enrollment = ? where course_id = ? and user_id = ?", [
          new Date().getTime(),
          course_id,
          user_id
        ]);
    }

    await conn.query("commit");
    return result;
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const createCourse = async (course, coaches, workouts) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");
    const [result] = await conn.query("INSERT INTO courses SET ?", [course]);

    const course_id = result.insertId;

    if (coaches.length > 0) {
      coaches = coaches.map((coach) => [course_id, coach.id, 1]);
      await conn.query("INSERT INTO course_user (course_id, user_id, is_coach) VALUES ?", [coaches]);
    }

    if (workouts.length > 0) {
      workouts = workouts.map((workout) => [course_id, workout.id]);
      await conn.query("INSERT INTO course_workout (course_id, workout_id) VALUES ?", [workouts]);
    }

    await conn.query("commit");
    return result;
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const updateCourse = async (course, coaches, workouts) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");

    const course_id = course.id;
    // start lock
    await conn.query("select id from courses where id = ? for update", [course_id]);

    // check if can update point or size
    const [original_enrolled] = await conn.query(`select * from course_user where course_id = ? and enrollment = 1`, [course_id]);
    const [original_waiting] = await conn.query(`select * from course_user where course_id = ? and enrollment > 1`, [course_id]);
    const [course_result] = await conn.query(`select * from courses where id = ?`, [course_id]);
    const original_point = course_result[0].point;
    const original_size = course_result[0].size;
    if (original_enrolled.length > 0 && course.point != original_point)
      throw { message: "You cannot update point when users have enrolled this course", status: 400 };
    if (original_waiting.length > 0 && course.size > original_size)
      throw { message: "You cannot increase size when there are users waiting for this course", status: 400 };
    if (original_enrolled.length > 0 && course.size < original_size)
      throw { message: "You cannot decrease size when there are users enrolled for this course", status: 400 };

    // update course
    const [result] = await conn.query(`UPDATE courses SET ? WHERE id = ? `, [course, course_id]);

    // set is_coach = 0 for all course user
    await conn.query(`update course_user set is_coach = 0 where course_id = ?`, [course_id]);
    const [original_course_users] = await conn.query(`select * from course_user where course_id = ? `, [course_id]);
    const original_course_user_ids = original_course_users.map((user) => user.user_id);
    for (let coach of coaches) {
      // cannot use forEach
      if (original_course_user_ids.includes(coach.id))
        await conn.query(`update course_user set is_coach = 1 where course_id = ? and user_id = ?`, [course_id, coach.id]);
      else await conn.query("INSERT INTO course_user set is_coach = 1, course_id = ?, user_id = ? ", [course_id, coach.id]);
    }

    // delete and re-add workouts
    await conn.query(`delete from course_workout where course_id = ?`, [course_id]);
    if (workouts.length > 0) {
      workouts = workouts.map((workout) => [course_id, workout.id]);
      await conn.query("INSERT INTO course_workout (course_id, workout_id) VALUES ?", [workouts]);
    }

    await conn.query("commit");
    return result;
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const getCourses = async () => {
  const [courses] = await pool.query(`
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
  `);

  return Utils.convertToObjWithCourseIdAsKey(courses);
};

const deleteCourse = async (id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("start transaction");

    await conn.query(`delete from course_user where course_id = ?`, [id]);
    await conn.query(`delete from course_workout where course_id = ?`, [id]);
    await conn.query(`delete from performances where course_id = ?`, [id]);
    const result = await conn.query(`delete from courses where id = ?`, [id]);

    await conn.query("commit");
    return result;
  } catch (error) {
    await conn.query("rollback");
    console.log(error);
    throw error;
  } finally {
    await conn.release();
  }
};

const getCourseOnly = async (course_id) => {
  const [result] = await pool.query("select * from courses where id = ?", [course_id]);
  return result[0];
};

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  enroll,
  quit,
  getCourseEnrolledmembers,
  enrollMemberByEmail,
  quitMemberById,
  checkoutMemberById,
  enrollMemberByExistingUserId,
  uncheckoutMemberById,
  removeMemberById,
  getCourseOnly
};
