const router = require("express").Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateStock,
} = require("../controllers/product.controller");

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/", createProduct);
router.put("/:productId/stock", updateStock);

module.exports = router;
