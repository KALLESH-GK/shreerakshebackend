const DroModel = require("../../models/admin/dro.model");

/* CREATE DRO */
exports.createDro = async (req, res) => {
  const { phone } = req.body;

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      message: "Phone number must be exactly 10 digits",
    });
  }

  await DroModel.create(req.body);
  res.json({ message: "DRO created successfully" });
};

/* GET ALL */
exports.getDros = async (req, res) => {
  const [rows] = await DroModel.getAll();
  res.json(rows);
};

/* UPDATE DRO */
exports.updateDro = async (req, res) => {
  const { phone } = req.body;

  if (phone && !/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      message: "Phone number must be exactly 10 digits",
    });
  }

  await DroModel.updateById(req.params.id, req.body);
  res.json({ message: "DRO updated successfully" });
};

exports.deleteDro = async (req, res) => {
  await DroModel.deleteById(req.params.id);
  res.json({ message: "DRO deleted successfully" });
};