const router = require("express").Router();
const authenticate = require("../middleware/auth.middleware");
const {
  createPayment,
  verifyPayment,
} = require("../controllers/payment.controller");

router.post("/create", authenticate, createPayment);
router.post("/verify", authenticate, verifyPayment);

module.exports = router;
