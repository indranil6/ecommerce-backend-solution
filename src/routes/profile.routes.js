const router = require("express").Router();
const authenticate = require("../middleware/auth.middleware");

const {
  getProfile,
  upsertProfile,
} = require("../controllers/profile.controller");

router.use(authenticate);

router.get("/", getProfile);

router.put("/", upsertProfile);

module.exports = router;
