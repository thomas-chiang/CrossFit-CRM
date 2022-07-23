require("dotenv").config();
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = process.env; // 30 days by seconds
const User = require("../server/models/user_model");
const VALID_STATUS = 1;
const MEMBER = 1;
const COACH = 2;
const GYM_OWNER = 3;
const IS_COACH = 1;

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()` middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
};

const authenticate = (role) => {
  return function (req, res, next) {
    let accessToken = req.get("Authorization");
    if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

    accessToken = accessToken.replace("Bearer ", "");
    if (accessToken == "null") return res.status(401).json({ error: "Unauthorized" });

    try {
      const user = jwt.verify(accessToken, TOKEN_SECRET);
      req.user = user;

      if (role === "member") next();
      else if (role === "coach" && user.role >= COACH) next();
      else if (role === "gym" && user.role >= GYM_OWNER) next();
      else if (role === "only member" && user.role == MEMBER) next();
      else return res.status(403).send({ error: "Forbidden" });
    } catch (err) {
      next(err);
    }
  };
};

const isValid = () => {
  return async function (req, res, next) {
    try {
      const user = req.user;
      const user_id = user.id;
      const role = user.role;
      const status = await User.getVaidStatus(user_id);

      if (status === VALID_STATUS) next();
      else if (status !== VALID_STATUS && role === GYM_OWNER)
        return res.status(400).send({
          error: "Please reach out to platform developer to validate your gym owner identity"
        });
      else
        return res.status(400).send({
          error: "Please reach out to gym owner to validate your account"
        });
    } catch (err) {
      next(err);
    }
  };
};

const addYoutubeIdProperty = (arrayOfObjs) => {
  arrayOfObjs.forEach((obj) => {
    let youtube_id = null;

    const originalYoutubeLink = obj.demo_link;

    if (originalYoutubeLink.includes("https://www.youtube.com/")) {
      youtube_id = originalYoutubeLink.slice(originalYoutubeLink.indexOf("watch?v=") + 8, originalYoutubeLink.indexOf("&"));
    }

    if (originalYoutubeLink.includes("https://youtu.be/")) {
      youtube_id = originalYoutubeLink.slice(17);
    }

    obj.youtube_id = youtube_id;
  });
};

const addYoutubeEmbedLinkProperty = (arrayOfObjs) => {
  arrayOfObjs.forEach((obj) => {
    let embedLink = "https://www.youtube.com/embed/";

    const youtube_id = obj.youtube_id;

    embedLink += youtube_id;

    obj.embed_link = embedLink;
  });
};

const addReactSelectProperties = (arrayOfObjs, propertyForValue, propertyForLabel) => {
  arrayOfObjs.forEach((obj) => {
    obj.value = obj[propertyForValue];
    obj.label = obj[propertyForLabel];
  });
};

const isStringArrPositiveIntegersOrZeros = (strArr) => {
  for (const str of strArr) {
    const number = Math.floor(Number(str));
    if (str !== null && str !== "" && (String(number) != str || number < 0)) return false;
  }
  return true;
};

const isStringArrItemLargerThan1M = (strArr) => {
  for (const str of strArr) {
    if (str > 1000000) return true;
  }
  return false;
};

const unitTotal = (workoutObj) => {
  let sum = 0;
  for (let property in workoutObj) {
    if (
      workoutObj[property] > 0 &&
      (property == "round" ||
        property == "extra_count" ||
        property == "minute" ||
        property == "extra_sec" ||
        property == "kg" ||
        property == "rep" ||
        property == "meter" ||
        property == "cal")
    )
      sum += workoutObj[property];
  }
  return sum;
};

const unitTotalForWorkout = (workoutObj) => {
  let sum = 0;
  for (let property in workoutObj) {
    if (
      workoutObj[property] > 0 &&
      (property == "round" || property == "extra_count" || property == "minute" || property == "extra_sec")
    )
      sum += workoutObj[property];
  }
  return sum;
};

const unitTotalForMovement = (workoutObj) => {
  let sum = 0;
  for (let property in workoutObj) {
    if (workoutObj[property] > 0 && (property == "kg" || property == "rep" || property == "meter" || property == "cal"))
      sum += workoutObj[property];
  }
  return sum;
};

const convertToObjWithWorkoutIdAsKey = (arr) => {
  addYoutubeIdProperty(arr);

  let obj = {};
  for (item of arr) {
    let movementObj = {
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
    case MEMBER:
      item.role = "Member";
      break;
    case COACH:
      item.role = "Coach";
      break;
    case GYM_OWNER:
      item.role = "Owner";
      break;
    default:
      item.role = "Member";
  }
};

const addReactSelectPropertiesForRole = (users) => {
  users.forEach((user) => {
    user.value = user.role;
    switch (user.role) {
      case MEMBER:
        user.label = "Member";
        break;
      case COACH:
        user.label = "Coach";
        break;
      case GYM_OWNER:
        user.label = "Owner";
        break;
    }
  });
};

const isCourseInputValid = (course) => {
  if (
    !course.start ||
    !course.end ||
    !course.title ||
    course.title.length > 255 ||
    !course.point ||
    course.point < 0 ||
    course.point > 2147483647 ||
    !course.size ||
    course.size <= 0 ||
    course.size > 2147483647
  )
    return false;

  return true;
};

const updateCoursePropertyByWorkoutObj = (course, workoutObj) => {
  let workouts = Object.keys(workoutObj).map((workout_id) => workoutObj[workout_id]);
  addReactSelectProperties(workouts, "id", "name");
  course.workouts = workouts;
};

const updateCoursePropertyByParticipantsObj = (course, participantsObj) => {
  let participants = Object.keys(participantsObj).map((user_id) => participantsObj[user_id]);
  addReactSelectProperties(participants, "id", "name");
  let coaches = participants.filter((participant) => participant.role >= COACH && participant.is_coach == IS_COACH);
  let members = participants.filter((participant) => participant.role >= MEMBER && participant.enrollment !== null);
  let enrolledMembers = members.filter((member) => member.enrollment >= 1);
  course.members = members.sort((a, b) => a.enrollment - b.enrollment);
  course.coaches = coaches;
  course.size_enrolled = enrolledMembers.length;
};

const convertToObjWithCourseIdAsKey = (courses) => {
  let obj = {};

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
  let obj = {};
  for (let performance of performances) {
    let courseId_userId = `${performance.course_id} ${performance.user_id}`;
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
    let course_id = courseId_userId.substring(0, courseId_userId.indexOf(" "));
    let user_id = courseId_userId.substring(courseId_userId.indexOf(" ") + 1);
    let leader = objWithCourseIdUserIdAsKey[courseId_userId];
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
  wrapAsync,
  authenticate,
  isValid,
  addYoutubeIdProperty,
  addYoutubeEmbedLinkProperty,
  addReactSelectProperties,
  isStringArrPositiveIntegersOrZeros,
  unitTotal,
  convertToObjWithWorkoutIdAsKey,
  isStringArrItemLargerThan1M,
  convertRoleKeyFromNumberToString,
  addReactSelectPropertiesForRole,
  isCourseInputValid,
  updateCoursePropertyByWorkoutObj,
  updateCoursePropertyByParticipantsObj,
  convertToObjWithCourseIdAsKey,
  unitTotalForWorkout,
  unitTotalForMovement,
  convertToCalculatedObjWithIdsAsKey,
  convertToArrWithLeaderScore
};
