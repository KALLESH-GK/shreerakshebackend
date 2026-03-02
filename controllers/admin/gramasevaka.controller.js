const GramasevakaModel = require("../../models/admin/gramasevaka.model");

/* ===============================
   CREATE GRAMASEVAKA
================================ */
exports.createGramasevaka = async (req, res) => {
  try {
    const { phone } = req.body;

    // 🔥 Phone validation (exactly 10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits",
      });
    }

    await GramasevakaModel.create(req.body);

    res.json({ message: "Gramasevaka created successfully" });
  } catch (err) {
    console.error("CREATE GRAMASEVAKA ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET GRAMASEVAKAS BY SKO
================================ */
exports.getGramasevakasBySko = async (req, res) => {
  try {
    const { jsko_id } = req.params;

    const [rows] = await GramasevakaModel.getBySko(jsko_id);

    res.json(rows);
  } catch (err) {
    console.error("FETCH GRAMASEVAKA ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   UPDATE GRAMASEVAKA
================================ */
exports.updateGramasevaka = async (req, res) => {
  try {
    const { name, phone, village } = req.body;

    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits",
      });
    }

    await GramasevakaModel.updateById(req.params.id, {
      name,
      phone,
      village,
    });

    res.json({ message: "Gramasevaka updated successfully" });
  } catch (err) {
    console.error("UPDATE GRAMASEVAKA ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   DELETE GRAMASEVAKA
================================ */
exports.deleteGramasevaka = async (req, res) => {
  try {
    await GramasevakaModel.deleteById(req.params.id);

    res.json({ message: "Gramasevaka deleted successfully" });
  } catch (err) {
    console.error("DELETE GRAMASEVAKA ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};