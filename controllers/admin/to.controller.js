const ToModel = require("../../models/admin/to.model");

exports.createTo = async (req, res) => {
  await ToModel.create(req.body);
  res.json({ message: "TO created successfully" });
};

exports.getTosByDro = async (req, res) => {
  const [rows] = await ToModel.getByDro(req.params.dro_id);
  res.json(rows);
};

exports.updateTo = async (req, res) => {
  await ToModel.updateById(req.params.id, req.body);
  res.json({ message: "TO updated successfully" });
};

exports.deleteTo = async (req, res) => {
  await ToModel.deleteById(req.params.id);
  res.json({ message: "TO deleted successfully" });
};
