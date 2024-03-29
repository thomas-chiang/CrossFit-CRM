const router = require("express").Router();
const { wrapAsync, authenticate, isValid } = require("../../utils/util");
const Course = require("../controllers/course_controller");

router.route("/course").post(authenticate("gym"), isValid(), wrapAsync(Course.createCourse));
router.route("/course").get(wrapAsync(Course.getCourses));
router.route("/course").put(authenticate("gym"), isValid(), wrapAsync(Course.updateCourse));
router.route("/course").delete(authenticate("gym"), isValid(), wrapAsync(Course.deleteCourse));
router.route("/course/enrollment/:id").post(authenticate("member"), isValid(), wrapAsync(Course.enroll));
router.route("/course/enrollment/:id").delete(authenticate("member"), isValid(), wrapAsync(Course.quit));
router.route("/course/enrolled/:course_id").get(wrapAsync(Course.getCourseEnrolledmembers));
router.route("/course/enrollmentbycoach/").post(authenticate("coach"), isValid(), wrapAsync(Course.enrollMemberByEmail));
router.route("/course/enrollmentbycoach/").delete(authenticate("coach"), isValid(), wrapAsync(Course.quitMemberById));
router
  .route("/course/enrollmentbycoach/:user_id")
  .post(authenticate("coach"), isValid(), wrapAsync(Course.enrollMemberByExistingUserId));
router.route("/course/checkout/").put(authenticate("gym"), isValid(), wrapAsync(Course.checkoutMemberById));
router.route("/course/uncheck/").put(authenticate("gym"), isValid(), wrapAsync(Course.uncheckoutMemberById));
router.route("/course/removeenrollment/").delete(authenticate("gym"), isValid(), wrapAsync(Course.removeMemberById));

module.exports = router;
