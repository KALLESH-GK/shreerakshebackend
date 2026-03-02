const SkoModel = require("../../models/admin/sko.model");

exports.createSko = async (req, res) => {
  const { phone } = req.body;

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      message: "Phone number must be exactly 10 digits",
    });
  }

  await SkoModel.create(req.body);
  res.json({ message: "SKO created successfully" });
};

exports.getSkosByTo = async (req, res) => {
  const [rows] = await SkoModel.getByTo(req.params.to_id);
  res.json(rows);
};

exports.updateSko = async (req, res) => {
  const { phone } = req.body;

  if (phone && !/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      message: "Phone number must be exactly 10 digits",
    });
  }

  await SkoModel.updateById(req.params.id, req.body);
  res.json({ message: "SKO updated successfully" });
};

exports.deleteSko = async (req, res) => {
  await SkoModel.deleteById(req.params.id);
  res.json({ message: "SKO deleted successfully" });
};