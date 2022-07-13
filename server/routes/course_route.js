const router = require('express').Router();
const {wrapAsync, authenticate, isValid} = require('../../utils/util');
const Course = require('../controllers/course_controller')

router.route('/course').post(authenticate('gym'), isValid(), wrapAsync(Course.createCourse));
router.route('/course').get(wrapAsync(Course.getCourses));
router.route('/course').put(authenticate('gym'), isValid(), wrapAsync(Course.updateCourse));
router.route('/course/delete/:id').delete(authenticate('gym'), isValid(), wrapAsync(Course.deleteCourse));
router.route('/course/enroll/:id').post(authenticate('member'), isValid(), wrapAsync(Course.enroll));
router.route('/course/enroll/:id').delete(authenticate('member'), isValid(), wrapAsync(Course.quit));
//router.route('/course/performance').post(authenticate('coach'), isValid(), wrapAsync(Course.createPerformance)); /////////
//router.route('/course/performance').put(authenticate('coach'), isValid(), wrapAsync(Course.updatePerformance));
//router.route('/course/performance').get(wrapAsync(Course.getPerformaces));
//router.route('/course/performance').delete(authenticate('coach'), isValid(), wrapAsync(Course.deletePerformance));
router.route('/course/enrolled/:course_id').get(wrapAsync(Course.getCourseEnrolledmembers));
router.route('/course/enrollmentbycoach/').post(authenticate('coach'), isValid(), wrapAsync(Course.enrollMemberByEmail));
router.route('/course/enrollmentbycoach/').delete(authenticate('coach'), isValid(), wrapAsync(Course.quitMemberById));
router.route('/course/enrollmentbycoach/').put(authenticate('gym'), isValid(), wrapAsync(Course.checkoutMemberById));
router.route('/course/enrollmentbycoach/existinguser').post(authenticate('coach'), isValid(), wrapAsync(Course.enrollMemberByExistingUserId));




module.exports = router;


