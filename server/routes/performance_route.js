const router = require('express').Router();
const {wrapAsync, authenticate, isValid} = require('../../utils/util');
const Performance = require('../controllers/performance_controller')

router.route('/performance').post(authenticate('coach'), isValid(), wrapAsync(Performance.createPerformance));
router.route('/performance').delete(authenticate('coach'), isValid(), wrapAsync(Performance.deletePerformance));
router.route('/performance').put(authenticate('coach'), isValid(), wrapAsync(Performance.updatePerformance));
router.route('/performance/courseuser').get(wrapAsync(Performance.getPerformancesByCourseUser));
router.route('/performance/movementworkoutname/:performance_id').get(wrapAsync(Performance.getPerformanceWithMovementWorkoutName));
router.route('/performance/usermovement/:movement_id').get(wrapAsync(Performance.getPerformanceByUserMovement))
router.route('/performance/movement/').get(wrapAsync(Performance.getPerformanceByMovement))
router.route('/performance/leaderboard/workout/:workout_id').get(wrapAsync(Performance.getLeaderboardByWorkout));
router.route('/performance/leaderboard/workout/').get(wrapAsync(Performance.getLeaderboardByWorkouts));
router.route('/performance/leaderboard/leader/').get(wrapAsync(Performance.getLeader));


module.exports = router;