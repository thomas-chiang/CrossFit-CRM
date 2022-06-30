const router = require('express').Router();
const {wrapAsync, authenticate } = require('../../utils/util');
const Controller = require('../controllers/token_controller')

router.route('/token').get(authenticate('member'), wrapAsync(Controller.authorizeToken));

module.exports = router;