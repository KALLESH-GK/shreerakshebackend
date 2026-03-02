const jwt = require("jsonwebtoken");

const admin = require("../models/admin.model");
const sko = require("../models/sko.model");
const gramasevaka = require("../models/gramasevaka.model");
const dro = require("../models/dro.model");
const to = require("../models/to.model");

exports.login = async (req, res) => {
  const { user_name, user_password } = req.body;

  if (!user_name || !user_password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  const tables = [
    { role: "admin", model: admin },
    { role: "sko", model: sko },
    { role: "gramasevaka", model: gramasevaka },
    { role: "dro", model: dro },
    { role: "to", model: to }
  ];

  for (const t of tables) {

    const user = await t.model.findByUsername(user_name);

    if (user) {

      // 🔥 PASSWORD CHECK
      if (user.user_password !== user_password) {
        return res.status(401).json({
          field: "password",
          message: "Incorrect password",
        });
      }

      // 🔥 SUCCESS LOGIN
      const token = jwt.sign(
        { id: user.id, role: t.role },
        process.env.JWT_SECRET,
        { expiresIn: "20m" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 20 * 60 * 1000
      });

      return res.json({ success: true, role: t.role });
    }
  }

  // 🔥 USERNAME NOT FOUND
  return res.status(401).json({
    field: "username",
    message: "Username not found",
  });
};

exports.logout = (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out successfully" });
};
