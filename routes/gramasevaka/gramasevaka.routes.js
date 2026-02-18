const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const ctrl = require("../../controllers/gramasevaka/gramasevaka.controller");

/* ===============================
   GET LOGGED-IN GRAMASEVAKA PROFILE
================================ */
router.get(
  "/me",
  auth.verify(["gramasevaka"]),
  ctrl.getMyProfile
);

module.exports = router;
