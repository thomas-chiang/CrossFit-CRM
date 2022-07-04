const router = require('express').Router();
const {wrapAsync, authenticate} = require('../../utils/util');
const Workout = require('../controllers/workout_controller')

router.route('/workout').post(authenticate('member'),wrapAsync(Workout.createWorkout));
router.route('/workout').get(wrapAsync(Workout.getWorkouts));
router.route('/workout').put(authenticate('member'),wrapAsync(Workout.updateWorkout));
router.route('/workout/owned').get(authenticate('member'),wrapAsync(Workout.getOwnedWorkouts));
router.route('/workout/movement').post(authenticate('member'),wrapAsync(Workout.createWorkoutWithMovement));
router.route('/workout/movement').get(wrapAsync(Workout.getWorkoutsWithMovements));
router.route('/workout/ownedmovement').get(authenticate('member'),wrapAsync(Workout.getOwnedWorkoutsWithMovements));
router.route('/workout/ownedmovement/').delete(authenticate('member'),wrapAsync(Workout.deleteWorkoutWorkoutWithMovements));
router.route('/workout/workoutmovement/:workout_movement_id').get(wrapAsync(Workout.getWorkoutMovement))
router.route('/workout/workoutmovement/').put(authenticate('member'), wrapAsync(Workout.updateWorkoutMovement))
router.route('/workout/workoutmovement/:workout_movement_id').delete(authenticate('member'), wrapAsync(Workout.deleteWorkoutMovement))
router.route('/workout/workout/:workout_id').get(wrapAsync(Workout.getWorkout));
router.route('/workout/addmovement').post(authenticate('member'),wrapAsync(Workout.addWorkoutMovement));
router.route('/workout/onlynameandnote').put(authenticate('member'),wrapAsync(Workout.updateOnlyNameAndNote));
router.route('/workout/workout/:workout_id').delete(authenticate('member'),wrapAsync(Workout.deleteWorkout));
router.route('/workout/workoutmovements/:workout_id').get(wrapAsync(Workout.getWorkoutMovements));



module.exports = router;