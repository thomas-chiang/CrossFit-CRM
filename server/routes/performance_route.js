const router = require("express").Router();
const { wrapAsync, authenticate, isValid } = require("../../utils/util");
const Performance = require("../controllers/performance_controller");

router.route("/performance").post(authenticate("coach"), isValid(), wrapAsync(Performance.createPerformance));
router.route("/performance").delete(authenticate("coach"), isValid(), wrapAsync(Performance.deletePerformance));
router.route("/performance").put(authenticate("coach"), isValid(), wrapAsync(Performance.updatePerformance));
router.route("/performance/courseuser").get(wrapAsync(Performance.getPerformancesByCourseUser));
router
  .route("/performance/movementworkoutname/:performance_id")
  .get(wrapAsync(Performance.getPerformanceWithMovementWorkoutName));
router.route("/performance/usermovement/:movement_id").get(wrapAsync(Performance.getPerformanceByUserMovement));
router.route("/performance/movement/").get(wrapAsync(Performance.getPerformanceByMovement));
router.route("/performance/leaderboard/workout/").get(wrapAsync(Performance.getSortedLeadersByWorkouts));
router.route("/performance/leaderboard/leader/").get(wrapAsync(Performance.getLeader));
router.route("/performance/workouts/:user_id").get(wrapAsync(Performance.getUserWorkouts));
router.route("/performance/workoutmovement/").get(wrapAsync(Performance.getPerformanceByWorkoutMovement));
router.route("/performance/analysis/").get(wrapAsync(Performance.getPerformanceByWorkout));

module.exports = router;
