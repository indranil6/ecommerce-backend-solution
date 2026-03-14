const router = require("express").Router();
const authenticate = require("../middleware/auth.middleware");
const {
  updateOrderStatus,
  getOrderStatus,
} = require("../controllers/orderStatus.controller");

// User: check order status
router.get("/:orderId/status", authenticate, getOrderStatus);

// Admin: update order status
router.put("/:orderId/status", authenticate, updateOrderStatus);

module.exports = router;
