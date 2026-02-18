const express = require("express");
const {
  createDro,
  getDros,
  updateDro,
  deleteDro,
} = require("../../controllers/admin/dro.controller");

const router = express.Router();

router.post("/", createDro);
router.get("/", getDros);
router.put("/:id", updateDro);
router.delete("/:id", deleteDro);

module.exports = router;
