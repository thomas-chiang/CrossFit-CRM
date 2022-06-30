const router = require('express').Router();
const {wrapAsync, authenticate} = require('../../utils/util');
const Course = require('../controllers/course_controller')

router.route('/course').post(authenticate('gym'), wrapAsync(Course.createCourse));
router.route('/course').get(wrapAsync(Course.getCourses));
router.route('/course').put(authenticate('gym'), wrapAsync(Course.updateCourse));
router.route('/course/delete/:id').delete(authenticate('gym'), wrapAsync(Course.deleteCourse));
router.route('/course/enroll/:id').post(authenticate('member'), wrapAsync(Course.enroll));
router.route('/course/enroll/:id').delete(authenticate('member'), wrapAsync(Course.quit));
router.route('/course/performance').post(authenticate('coach'), wrapAsync(Course.createPerformance));
router.route('/course/performance').put(authenticate('coach'), wrapAsync(Course.updatePerformance));
router.route('/course/performance').get(wrapAsync(Course.getPerformaces));
router.route('/course/performance').delete(authenticate('coach'), wrapAsync(Course.deletePerformance));
router.route('/course/enrolled/:course_id').get(wrapAsync(Course.getCourseEnrolledmembers));
router.route('/course/enrollmentbycoach/').post(authenticate('coach'), wrapAsync(Course.enrollMemberByEmail));
router.route('/course/enrollmentbycoach/').delete(authenticate('coach'), wrapAsync(Course.quitMemberById));
router.route('/course/enrollmentbycoach/').put(authenticate('coach'), wrapAsync(Course.checkoutMemberById));



module.exports = router;


