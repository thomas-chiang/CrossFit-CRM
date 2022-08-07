require("dotenv").config();
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = process.env; // 30 days by seconds
const User = require("../server/models/user_model");
const VALID_STATUS = 1;
const ROLE = {
  MEMBER: 1,
  COACH: 2,
  GYM_OWNER: 3
}

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
      else if (role === "coach" && user.role >= ROLE.COACH) next();
      else if (role === "gym" && user.role >= ROLE.GYM_OWNER) next();
      else if (role === "only member" && user.role == ROLE.MEMBER) next();
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
      else if (status !== VALID_STATUS && role === ROLE.GYM_OWNER)
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



module.exports = {
  wrapAsync,
  authenticate,
  isValid,
  isStringArrPositiveIntegersOrZeros,
  unitTotal,
  isStringArrItemLargerThan1M,
  isCourseInputValid,
  unitTotalForWorkout,
  unitTotalForMovement,
};
