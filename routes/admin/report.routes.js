const router = require("express").Router();
const { verify } = require("../../middleware/auth.middleware");
const ctrl = require("../../controllers/admin/report.controller");


router.get("/dro", verify(["admin", "dro"]), ctrl.getDroReport);
router.get("/dro/:droId/to", verify(["admin", "dro"]), ctrl.getTosUnderDro);
router.get("/to/:toId/sko", verify(["admin", "dro"]), ctrl.getSkosUnderTo);
router.get("/sko/:skoId/gramasevaka", verify(["admin", "dro"]), ctrl.getGramasevakasUnderSko);
router.get(
  "/to/jsko",
  verify(["to"]),
  ctrl.getSkosUnderLoggedInTo
);

/* Gramasevakas under selected JSKO */
router.get(
  "/to/jsko/:skoId/gramasevaka",
  verify(["to"]),
  ctrl.getGramasevakasUnderJskoForTo
);


module.exports = router;

