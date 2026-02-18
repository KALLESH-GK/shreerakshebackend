const Gramasevaka = require("../../models/gramasevaka/gramasevaka.model");

/* ===============================
   GET MY GRAMASEVAKA PROFILE
================================ */
exports.getMyProfile = async (req, res) => {
  try {
    const gramasevakaId = req.user.id;

    const gramasevaka = await Gramasevaka.getProfileById(gramasevakaId);

    if (!gramasevaka) {
      return res.status(404).json({ message: "Gramasevaka not found" });
    }

    res.json({
      id: gramasevaka.id,
      user_id: gramasevaka.user_id,
      name: gramasevaka.name,
      user_name: gramasevaka.user_name,
      phone: gramasevaka.phone,
      user_type: gramasevaka.user_type,
      dro_id: gramasevaka.dro_id,
      to_id: gramasevaka.to_id,
      jsko_id: gramasevaka.jsko_id,
      village: gramasevaka.village,
      created_on: gramasevaka.created_on
    });

  } catch (err) {
    console.error("GRAMASEVAKA PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
