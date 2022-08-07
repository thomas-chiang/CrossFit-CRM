const Course = require("../models/course_model");
const User = require("../models/user_model");
const validator = require("validator");
const Utils = require("../../utils/util");
const moment = require("moment");
const mailUtil = require("../../utils/mail_util");
const { EMAIL_SENDER, DOMAIN_NAME } = process.env;

const removeMemberById = async (req, res) => {
  const creator_id = req.user.id;
  const { user_id, course_id, enrollment } = req.query;
  const result = await Course.removeMemberById(course_id, user_id, enrollment, creator_id);
  res.json(result);
};

const uncheckoutMemberById = async (req, res) => {
  const creator_id = req.user.id;
  const { user_id, course_id, enrollment } = req.query;
  const result = await Course.uncheckoutMemberById(course_id, user_id, enrollment, creator_id);
  res.json(result);
};

const checkoutMemberById = async (req, res) => {
  const creator_id = req.user.id;
  const { user_id, course_id, enrollment } = req.query;
  if (enrollment != 1) return res.status(400).json({ error: "Must first enroll the user into the course before checking out" });
  const result = await Course.checkoutMemberById(course_id, user_id, enrollment, creator_id);
  res.json(result);
};

const quitMemberById = async (req, res) => {
  const creator_id = req.user.id;
  const { user_id, course_id, enrollment } = req.query;
  if (enrollment != 1) return res.status(400).json({ error: "Must first enroll the user into the course before quiting" });
  const result = await Course.quitMemberById(course_id, user_id, enrollment, creator_id);
  res.json(result);
};

const enrollMemberByExistingUserId = async (req, res) => {
  const creator_id = req.user.id;
  const user_id = req.params.user_id;
  const { course_id } = req.query;
  const result = await Course.enrollMemberByExistingUserId(course_id, user_id, creator_id);
  res.json(result);
};

const enrollMemberByEmail = async (req, res) => {
  const creator_id = req.user.id;
  const { email, course_id } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required." });
  if (!validator.isEmail(email)) return res.status(400).json({ error: "Invalid email format" });
  const result = await Course.enrollMemberByEmail(course_id, email, creator_id);
  res.json(result);
};

const getCourseEnrolledmembers = async (req, res) => {
  const course_id = req.params.course_id;
  const result = await Course.getCourseEnrolledmembers(course_id);
  res.json(result);
};

const quit = async (req, res) => {
  const course_id = req.params.id;
  const user_id = req.user.id;
  const next_user_id = await Course.quit(course_id, user_id);
  if (next_user_id) {
    const course = await Course.getCourseOnly(course_id);
    const next_user = await User.getUserOnly(next_user_id);
    const mailOptions = {
      from: EMAIL_SENDER,
      to: next_user.email,
      subject: `Notification: Waiting to Enrolled`,
      html: `
        <p>Hi ${next_user.name},</p>    
        
        <p>Thanks for your waiting.</p>
        <p>You have been successfully enrolled into ${course.title} at ${moment(course.start).format("YYYY/MM/DD H:mm:ss A")}.</p>

        <p>This is a system response, so please do not reply this email.</p>
        <p>If you want to quit the course or unsubscribe from the email list, please go to ${DOMAIN_NAME} for more customized settings.</p>
        
        <p>Best</p>
        <p>Crossfit Team</p>
      `
    };
    try {
      await mailUtil.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
  }
  res.json(next_user_id);
};

const enroll = async (req, res) => {
  const course_id = req.params.id;
  const user_id = req.user.id;
  const result = await Course.enroll(course_id, user_id);
  res.json(result);
};

const createCourse = async (req, res) => {
  const course = req.body;
  if (!Utils.isCourseInputValid(course))
    return res.status(400).json({
      error:
        "Course must have start time, end time, point(>=0 and < 2147483647), size(>0 and < 2147483647), title(less then 255 characters)"
    });

  if (!moment(course.start).isValid() || !moment(course.start).isValid())
    return res.status(400).json({ error: "start time or end time is not valid" });

  if (Date.parse(course.start) >= Date.parse(course.end))
    return res.status(400).json({ error: "start time must be earilier than end time" });

  course.creator_id = req.user.id;

  const coaches = course.coaches ? course.coaches : [];
  const workouts = course.workouts ? course.workouts : [];
  delete course.coaches;
  delete course.workouts;

  const result = await Course.createCourse(course, coaches, workouts);

  res.json(result);
};

const updateCourse = async (req, res) => {
  const course = req.body;
  if (!Utils.isCourseInputValid(course))
    return res.status(400).json({
      error:
        "Course must have start time, end time, point(>=0 and < 2147483647), size(>0 and < 2147483647), title(less then 255 characters)"
    });

  if (!moment(course.start).isValid() || !moment(course.start).isValid())
    return res.status(400).json({ error: "start time or end time is not valid" });

  if (Date.parse(course.start) >= Date.parse(course.end))
    return res.status(400).json({ error: "start time must be earilier than end time" });

  course.creator_id = req.user.id;

  const coaches = course.coaches ? course.coaches : [];
  const workouts = course.workouts ? course.workouts : [];
  delete course.coaches;
  delete course.members;
  delete course.workouts;

  const result = await Course.updateCourse(course, coaches, workouts);
  res.json(result);
};

const getCourses = async (req, res) => {
  const obj = await Course.getCourses();

  const arr = Object.keys(obj).map((course_id) => {
    const course = obj[course_id];

    const participantsObj = course.participants;
    if (participantsObj) Utils.updateCoursePropertyByParticipantsObj(course, participantsObj);
    else course.size_enrolled = 0;

    const workoutObj = course.workouts;
    if (workoutObj) Utils.updateCoursePropertyByWorkoutObj(course, workoutObj);

    return obj[course_id];
  });

  res.json(arr);
};

const deleteCourse = async (req, res) => {
  const id = req.query.course_id;
  const result = await Course.deleteCourse(id);
  res.json(result);
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
  removeMemberById
};
