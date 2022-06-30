const router = require('express').Router();
const {wrapAsync, authenticate} = require('../../utils/util');
const Controller = require('../controllers/gym_controller')

router.route('/gym').post(authenticate('gym'), wrapAsync(Controller.createGym));
router.route('/gym').get(wrapAsync(Controller.getGyms));
router.route('/gym').put(authenticate('gym'), wrapAsync(Controller.updateGym));
router.route('/gym/:id').delete(authenticate('gym'), wrapAsync(Controller.deleteGym));
router.route('/gym/owned').get(authenticate('gym'), wrapAsync(Controller.getOwnedGyms));

module.exports = router;