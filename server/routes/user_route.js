const router = require("express").Router();
const { wrapAsync, authenticate, isValid } = require("../../utils/util");
const User = require("../controllers/user_controller");

router.route("/user/signup").post(wrapAsync(User.signUp));
router.route("/user/signin").post(wrapAsync(User.signIn));
router.route("/user/profile").get(authenticate("member"), wrapAsync(User.getUserProfile));
router.route("/user/role/:role").get(wrapAsync(User.getUsersByRole));
router.route("/user/role/").put(authenticate("gym"), isValid(), wrapAsync(User.updateRole));
router.route("/user/validcoaches").get(wrapAsync(User.getValidCoaches));
router.route("/user/coach").get(wrapAsync(User.getCoaches));
router.route("/user/valid").put(authenticate("gym"), isValid(), wrapAsync(User.updateValidStatus));
router.route("/user/point").post(authenticate("gym"), isValid(), wrapAsync(User.insertPoint));
router.route("/user/point/:user_id").get(wrapAsync(User.getPointsByUser));
router.route("/user/point/:point_id").delete(authenticate("gym"), isValid(), wrapAsync(User.deletePointById));
router.route("/user/sumpoint/:user_id").get(wrapAsync(User.getSumPointsByUser));

module.exports = router;
