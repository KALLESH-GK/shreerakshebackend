const router = require("express").Router();
const ctrl = require("../../controllers/application/application.controller");
const { verify } = require("../../middleware/auth.middleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

/* CREATE */
router.post(
  "/applications",
  verify(),
  upload.fields([
    { name: "adhar", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  ctrl.createApplication
);

/* SKO */
router.get("/applications/by-gramasevaka", verify(["sko"]), ctrl.getApplicationsByGramasevaka);
router.get("/applications/my", verify(["sko"]), ctrl.getMyApplications);
router.put("/applications/:id/approve", verify(["sko"]), ctrl.updateAndApproveApplication);

/* GRAMASEVAKA */
router.get("/applications/my-gramasevaka", verify(["gramasevaka"]), ctrl.getMyGramasevakaApplications);

/* ADMIN */
router.get("/applications/admin/all", verify(["admin"]), ctrl.getAdminApplications);

/* 🔥 ADMIN UPDATE ONLY */
router.put(
  "/applications/admin/:id/update",
  verify(["admin"]),
  ctrl.adminUpdateApplication
);

router.get("/applications/to", verify(["to"]), ctrl.getToApplications);
router.get("/applications/dro", verify(["dro"]), ctrl.getDroApplications);
module.exports = router;
