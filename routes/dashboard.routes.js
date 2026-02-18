const router = require("express").Router();
const { verify } = require("../middleware/auth.middleware");

router.get("/admin", verify(["admin"]), (req, res) => res.json({ ok: true }));
router.get("/sko", verify(["sko"]), (req, res) => res.json({ ok: true }));
router.get("/gramasevaka", verify(["gramasevaka"]), (req, res) => res.json({ ok: true }));
router.get("/dro", verify(["dro"]), (req, res) => res.json({ ok: true }));
router.get("/to", verify(["to"]), (req, res) => res.json({ ok: true }));

module.exports = router;
