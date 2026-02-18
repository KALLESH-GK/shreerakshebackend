const express = require("express");

const droRoutes = require("./admin/dro.routes");
const toRoutes = require("./admin/to.routes");
const skoRoutes = require("./admin/sko.routes");
const gramasevakaRoutes = require("./admin/gramasevaka.routes");

const router = express.Router();

router.use("/admin/dro", droRoutes);
router.use("/admin/to", toRoutes);
router.use("/admin/sko", skoRoutes);
router.use("/admin/gramasevaka", gramasevakaRoutes);

module.exports = router;
