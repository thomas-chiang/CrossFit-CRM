require("dotenv").config();
const ObjPropertyUtils = require("./obj_property_util")
const ROLE = {
  MEMBER: 1,
  COACH: 2,
  GYM_OWNER: 3
}


const convertToObjWithWorkoutIdAsKey = (arr) => {
  ObjPropertyUtils.addYoutubeIdProperty(arr);

  const obj = {};
  for (item of arr) {
    const movementObj = {
      id: item.workout_movement_id,
      movement_id: item.movement_id,
      workout_id: item.workout_id,
      name: item.movement_name,
      kg: item.kg,
      cal: item.cal,
      rep: item.rep,
      meter: item.meter,
      youtube_id: item.youtube_id
    };

    if (obj[item.id]) {
      obj[item.id].movements.push(movementObj);
    } else {
      obj[item.id] = {
        id: item.id,
        name: item.name,
        round: item.round,
        extra_count: item.extra_count,
        minute: item.minute,
        extra_sec: item.extra_sec,
        note: item.note,
        creator_id: item.creator_id,
        movements: [movementObj]
      };
    }

    if (!obj[item.id].movements[0].id) delete obj[item.id].movements;
  }

  return obj;
};

const convertRoleKeyFromNumberToString = (item) => {
  switch (item.role) {
    case ROLE.MEMBER:
      item.role = "Member";
      break;
    case ROLE.COACH:
      item.role = "Coach";
      break;
    case ROLE.GYM_OWNER:
      item.role = "Owner";
      break;
    default:
      item.role = "Member";
  }
};


const convertToObjWithCourseIdAsKey = (courses) => {
  const obj = {};

  const toCourseUserObj = (course) => ({
    id: course.user_id,
    role: course.role,
    name: course.user_name,
    enrollment: course.enrollment,
    is_coach: course.is_coach
  });

  const toCourseWorkoutObj = (course) => ({
    id: course.workout_id,
    name: course.workout_name,
    round: course.workout_round,
    extra_count: course.workout_extra_count,
    minute: course.workout_minute,
    extra_sec: course.workout_extra_sec,
    note: course.workout_note
  });

  for (let course of courses) {
    if (obj[course.id]) {
      if (course.user_id) {
        obj[course.id].participants = { ...obj[course.id].participants, [course.user_id]: toCourseUserObj(course) };
      }
      if (course.workout_id) {
        obj[course.id].workouts = { ...obj[course.id].workouts, [course.workout_id]: toCourseWorkoutObj(course) };
      }
    } else {
      obj[course.id] = {
        id: course.id,
        creator_id: course.creator_id,
        title: course.title,
        size: course.size,
        start: course.start,
        end: course.end,
        note: course.note,
        point: course.point
      };
      if (course.user_id) {
        obj[course.id] = { ...obj[course.id], participants: { [course.user_id]: toCourseUserObj(course) } };
      }
      if (course.workout_id) {
        obj[course.id] = { ...obj[course.id], workouts: { [course.workout_id]: toCourseWorkoutObj(course) } };
      }
    }
  }
  return obj;
};

const convertToCalculatedObjWithIdsAsKey = (performances) => {
  const obj = {};
  for (let performance of performances) {
    const courseId_userId = `${performance.course_id} ${performance.user_id}`;
    obj[courseId_userId] = {
      name: performance.name,
      ratio: obj[courseId_userId]?.ratio ? obj[courseId_userId].ratio * performance.ratio : performance.ratio,
      round_m: performance.round_m,
      minute_m: performance.minute_m,
      kg_m: obj[courseId_userId]?.kg_m ? obj[courseId_userId].kg_m * performance.kg_m : performance.kg_m,
      rep_m: obj[courseId_userId]?.rep_m ? obj[courseId_userId].rep_m * performance.rep_m : performance.rep_m,
      meter_m: obj[courseId_userId]?.meter_m ? obj[courseId_userId].meter_m * performance.meter_m : performance.meter_m,
      cal_m: obj[courseId_userId]?.cal_m ? obj[courseId_userId].cal_m * performance.cal_m : performance.cal_m
    };
  }

  return obj;
};

const convertToArrWithLeaderScore = (workout_id, objWithCourseIdUserIdAsKey) => {
  return Object.keys(objWithCourseIdUserIdAsKey).map((courseId_userId) => {
    const course_id = courseId_userId.substring(0, courseId_userId.indexOf(" "));
    const user_id = courseId_userId.substring(courseId_userId.indexOf(" ") + 1);
    const leader = objWithCourseIdUserIdAsKey[courseId_userId];
    return {
      workout_id,
      course_id,
      user_id,
      score: leader.ratio * leader.round_m * leader.minute_m * 100,
      name: leader.name,
      round: leader.round_m * 100,
      minute: leader.minute_m * 100,
      kg: leader.kg_m * 100,
      rep: leader.rep_m * 100,
      meter: leader.meter_m * 100,
      cal: leader.cal_m * 100,
      other: leader.ratio * 100,
      round_minute: leader.round_m * leader.minute_m * 100
    };
  });
};

module.exports = {
  convertToObjWithWorkoutIdAsKey,
  convertRoleKeyFromNumberToString,
  convertToObjWithCourseIdAsKey,
  convertToCalculatedObjWithIdsAsKey,
  convertToArrWithLeaderScore
};
