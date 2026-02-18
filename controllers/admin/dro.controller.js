const DroModel = require("../../models/admin/dro.model");

exports.createDro = async (req, res) => {
  await DroModel.create(req.body);
  res.json({ message: "DRO created successfully" });
};

exports.getDros = async (req, res) => {
  const [rows] = await DroModel.getAll();
  res.json(rows);
};

exports.updateDro = async (req, res) => {
  await DroModel.updateById(req.params.id, req.body);
  res.json({ message: "DRO updated successfully" });
};

exports.deleteDro = async (req, res) => {
  await DroModel.deleteById(req.params.id);
  res.json({ message: "DRO deleted successfully" });
};


