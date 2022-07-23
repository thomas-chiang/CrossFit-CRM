const router = require("express").Router();
const { wrapAsync, authenticate, isValid } = require("../../utils/util");
const Workout = require("../controllers/workout_controller");

router.route("/workout").get(wrapAsync(Workout.getWorkouts));
router.route("/workout").put(authenticate("coach"), isValid(), wrapAsync(Workout.updateWorkout));
router.route("/workout/movement").post(authenticate("coach"), isValid(), wrapAsync(Workout.createWorkoutWithMovements));
router.route("/workout/movement").get(wrapAsync(Workout.getWorkoutsWithMovements));
router.route("/workout/workoutmovement/:workout_movement_id").get(wrapAsync(Workout.getWorkoutMovement));
router.route("/workout/workoutmovement/").put(authenticate("coach"), isValid(), wrapAsync(Workout.updateWorkoutMovement));
router
  .route("/workout/workoutmovement/:workout_movement_id")
  .delete(authenticate("coach"), isValid(), wrapAsync(Workout.deleteWorkoutMovement));
router.route("/workout/workout/:workout_id").get(wrapAsync(Workout.getWorkout));
router.route("/workout/addmovement").post(authenticate("coach"), isValid(), wrapAsync(Workout.addWorkoutMovement));
router.route("/workout/onlyworkout").put(authenticate("coach"), isValid(), wrapAsync(Workout.updateOnlyWorkout));
router.route("/workout/workout/:workout_id").delete(authenticate("coach"), isValid(), wrapAsync(Workout.deleteWorkout));
router.route("/workout/workoutmovements/:workout_id").get(wrapAsync(Workout.getWorkoutMovements));
router.route("/workout/distinctworkoutmovements/:workout_id").get(wrapAsync(Workout.getDistinctWorkoutMovements));

module.exports = router;
