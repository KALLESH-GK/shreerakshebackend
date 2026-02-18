const express = require("express");
const {
  createTo,
  getTosByDro,
  updateTo,
  deleteTo,
} = require("../../controllers/admin/to.controller");

const router = express.Router();

router.post("/", createTo);
router.get("/dro/:dro_id", getTosByDro);
router.put("/:id", updateTo);
router.delete("/:id", deleteTo);

module.exports = router;
