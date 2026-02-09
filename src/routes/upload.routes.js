const router = require("express").Router();
const upload = require("../middleware/upload.middleware");
// const authenticate = require("../middleware/auth.middleware");
const { uploadProductImage } = require("../controllers/upload.controller");

router.post(
  "/product-image",
  //   authenticate, // 🔐 AUTH REQUIRED
  upload.single("image"),
  uploadProductImage,
);

module.exports = router;
