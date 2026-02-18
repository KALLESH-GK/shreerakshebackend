const GramasevakaModel = require("../../models/admin/gramasevaka.model");

exports.createGramasevaka = async (req, res) => {
  await GramasevakaModel.create(req.body);
  res.json({ message: "Gramasevaka created successfully" });
};

exports.getGramasevakasBySko = async (req, res) => {
  const [rows] = await GramasevakaModel.getBySko(req.params.jsko_id);
  res.json(rows);
};

exports.updateGramasevaka = async (req, res) => {
  await GramasevakaModel.updateById(req.params.id, req.body);
  res.json({ message: "Gramasevaka updated successfully" });
};

exports.deleteGramasevaka = async (req, res) => {
  await GramasevakaModel.deleteById(req.params.id);
  res.json({ message: "Gramasevaka deleted successfully" });
};

