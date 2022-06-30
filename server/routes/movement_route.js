const router = require('express').Router();
const { wrapAsync, authenticate } = require('../../utils/util');
const Movement = require('../controllers/movement_controller')

router.route('/movement').post(authenticate('member'), wrapAsync(Movement.createMovement));
router.route('/movement').get(wrapAsync(Movement.getMovements));
router.route('/movement').put(authenticate('member'), wrapAsync(Movement.updateMovement));
router.route('/movement/:id').delete(authenticate('member'), wrapAsync(Movement.deleteMovement));
router.route('/movement/owned').get(authenticate('member'),wrapAsync(Movement.getOwnedMovements));
router.route('/movement/option').get(wrapAsync(Movement.getMovementOptions));

module.exports = router;
