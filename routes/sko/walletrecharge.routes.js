const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const ctrl = require("../../controllers/sko/walletrecharge.controller");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post(
  "/wallet-recharge",
  auth.verify(["sko"]),
  upload.single("screenshot"), 
  ctrl.createRecharge
);

router.get(
  "/wallet-recharge/my",
  auth.verify(["sko"]),
  ctrl.getMyRecharges
);

router.put(
  "/wallet-recharge/:id/approve",
  auth.verify(["admin"]),
  ctrl.approveRecharge
);

module.exports = router;


router.get(
  "/wallet-recharge",
  auth.verify(["admin"]),
  ctrl.getAllRecharges
);



