const router = require("express").Router();
const authenticate = require("../middleware/auth.middleware");

const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/address.controller");

router.use(authenticate);

router.get("/", getAddresses);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

router.put("/:id/default", setDefaultAddress);

module.exports = router;
