const router = require("express").Router();
const authenticate = require("../middleware/auth.middleware");
const { createOrderFromCart } = require("../controllers/order.controller");

router.post("/create", authenticate, createOrderFromCart);

module.exports = router;
