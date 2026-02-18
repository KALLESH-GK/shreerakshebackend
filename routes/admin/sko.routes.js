const express = require("express");
const {
  createSko,
  getSkosByTo,
  updateSko,
  deleteSko,
} = require("../../controllers/admin/sko.controller");

const router = express.Router();

router.post("/", createSko);
router.get("/to/:to_id", getSkosByTo);
router.put("/:id", updateSko);
router.delete("/:id", deleteSko);

module.exports = router;
