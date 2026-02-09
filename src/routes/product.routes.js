const router = require("express").Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
} = require("../controllers/product.controller");

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/", createProduct);

module.exports = router;
