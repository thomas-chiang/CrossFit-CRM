const getCoursePoint = async (connection, course_id) => {
  let [course_result] = await connection.query(`select point from courses where id = ?`, [course_id]);
  return course_result[0].point;
};

const getAvailablePointsByUser = async (connection, user_id) => {
  let [points_result] = await connection.query(
    ` select IFNULL(sum(point),0) - IFNULL(sum(point_to_be_deducted),0) as points_available from points where user_id = ? `,
    [user_id]
  );
  return parseInt(points_result[0].points_available);
};

const isUserOnEnrollmentList = async (connection, course_id, user_id) => {
  let [course_user_result] = await connection.query(
    `select * from course_user where course_id = ? and user_id = ? and enrollment >= 0`,
    [course_id, user_id]
  );
  return course_user_result.length > 0;
};

const isUserOnCourseList = async (connection, course_id, user_id) => {
  let [course_user_result] = await connection.query(`select * from course_user where course_id = ? and user_id = ? `, [
    course_id,
    user_id
  ]);
  return course_user_result.length > 0;
};

const userEnrollmentStatusOnCourse = async (connection, course_id, user_id) => {
  let [course_user_result] = await connection.query(
    `select * from course_user where course_id = ? and user_id = ? and enrollment > 0`,
    [course_id, user_id]
  );
  return course_user_result[0]?.enrollment;
};

const getNextUserId = async (connection, course_id, course_point) => {
  let [next_users_result] = await connection.query(
    ` 
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
  `,
    [course_id, course_point]
  );
  return next_users_result[0]?.user_id;
};

const getAvailableSpots = async (connection, course_id) => {
  let [enrolled_result] = await connection.query(
    ` 
    select count(*) as enrolled
    from course_user 
    where course_user.course_id = ? 
    and course_user.enrollment = 1
  `,
    [course_id]
  );

  let [course_result] = await connection.query(` select size from courses where id = ? `, [course_id]);

  return course_result[0].size - enrolled_result[0].enrolled;
};

module.exports = {
  getCoursePoint,
  getAvailablePointsByUser,
  isUserOnEnrollmentList,
  isUserOnCourseList,
  userEnrollmentStatusOnCourse,
  getNextUserId,
  getAvailableSpots
};
