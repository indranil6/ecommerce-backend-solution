const router = require("express").Router();
const authenticate = require("../middleware/auth.middleware");
const { createOrderFromCart } = require("../controllers/order.controller");

router.post("/create", authenticate, createOrderFromCart);
router.get("/my-orders", authenticate, getMyOrders);
router.get("/:id", authenticate, getOrderById);

module.exports = router;
