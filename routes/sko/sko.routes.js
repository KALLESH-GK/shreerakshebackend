const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const ctrl = require("../../controllers/sko/sko.controller");

router.get("/me", auth.verify(["sko"]), ctrl.getMyProfile);

module.exports = router;
