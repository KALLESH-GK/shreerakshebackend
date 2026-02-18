const Sko = require("../../models/sko/sko.model");

exports.getMyProfile = async (req, res) => {
  try {
    const jskoId = req.user.id;

    const sko = await Sko.getProfileById(jskoId);

    if (!sko) {
      return res.status(404).json({ message: "SKO not found" });
    }

    res.json({
      id: sko.id,
      name: sko.name,
      user_name: sko.user_name,
      phone: sko.phone,
      email: sko.email,
      center_name: sko.center_name,
      wallet_balance: sko.wallet_balance,
      user_type: sko.user_type
    });

  } catch (err) {
    console.error("SKO PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
