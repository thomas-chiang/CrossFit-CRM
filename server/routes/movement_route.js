const router = require("express").Router();
const { wrapAsync, authenticate, isValid } = require("../../utils/util");
const Movement = require("../controllers/movement_controller");

router.route("/movement").post(authenticate("coach"), isValid(), wrapAsync(Movement.createMovement));
router.route("/movement").get(wrapAsync(Movement.getMovements));
router.route("/movement").put(authenticate("coach"), isValid(), wrapAsync(Movement.updateMovement));
router.route("/movement/:id").delete(authenticate("coach"), isValid(), wrapAsync(Movement.deleteMovement));

module.exports = router;
