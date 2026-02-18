const SkoModel = require("../../models/admin/sko.model");

exports.createSko = async (req, res) => {
  await SkoModel.create(req.body);
  res.json({ message: "SKO created successfully" });
};

exports.getSkosByTo = async (req, res) => {
  const [rows] = await SkoModel.getByTo(req.params.to_id);
  res.json(rows);
};

exports.updateSko = async (req, res) => {
  await SkoModel.updateById(req.params.id, req.body);
  res.json({ message: "SKO updated successfully" });
};

exports.deleteSko = async (req, res) => {
  await SkoModel.deleteById(req.params.id);
  res.json({ message: "SKO deleted successfully" });
};
