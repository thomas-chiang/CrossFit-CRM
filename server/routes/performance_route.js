const router = require('express').Router();
const {wrapAsync, authenticate} = require('../../utils/util');
const Performance = require('../controllers/performance_controller')

router.route('/performance').post(authenticate('coach'),wrapAsync(Performance.createPerformance));
router.route('/performance').delete(authenticate('coach'),wrapAsync(Performance.deletePerformance));
router.route('/performance').put(authenticate('coach'),wrapAsync(Performance.updatePerformance));
router.route('/performance/courseuser').get(wrapAsync(Performance.getPerformancesByCourseUser));
router.route('/performance/movementworkoutname/:performance_id').get(wrapAsync(Performance.getPerformanceWithMovementWorkoutName));
router.route('/performance/usermovement/:movement_id').get(authenticate('member'),wrapAsync(Performance.getPerformanceByUserMovement))
router.route('/performance/movement/').get(wrapAsync(Performance.getPerformanceByMovement))


module.exports = router;