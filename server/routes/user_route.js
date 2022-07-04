const router = require('express').Router();
const {wrapAsync, authenticate } = require('../../utils/util');
const User = require('../controllers/user_controller')

router.route('/user/signup').post(wrapAsync(User.signUp));
router.route('/user/signin').post(wrapAsync(User.signIn));
router.route('/user/profile').get(authenticate('member'), wrapAsync(User.getUserProfile));
router.route('/user/role/:role').get(wrapAsync(User.getUsersByRole));
router.route('/user/addmember').post(authenticate('gym'),wrapAsync(User.addUserToGymbyEmail));
router.route('/user/bygymandrole').get(authenticate('gym'), wrapAsync(User.getUsersByGymAndRole));
router.route('/user/bygym').delete(authenticate('gym'), wrapAsync(User.deleteUserByGym));
router.route('/user/validcoaches').get(wrapAsync(User.getValidCoaches));
router.route('/user/coach').get(wrapAsync(User.getCoaches))
router.route('/user/valid').put(wrapAsync(User.updateValidStatus))
router.route('/user/point').put(wrapAsync(User.updatePoint))



module.exports = router;