const express = require("express");
const {
  createGramasevaka,
  getGramasevakasBySko,
  updateGramasevaka,
  deleteGramasevaka,
} = require("../../controllers/admin/gramasevaka.controller");

const router = express.Router();

router.post("/", createGramasevaka);
router.get("/sko/:jsko_id", getGramasevakasBySko);
router.put("/:id", updateGramasevaka);
router.delete("/:id", deleteGramasevaka);

module.exports = router;
