const { getDb } = require("../db/connection");

/* 🔹 Find user by username */
exports.findByUsername = async (user_name) => {
  const db = getDb();

  const [rows] = await db.query(
    `SELECT * FROM admin WHERE user_name = ? LIMIT 1`,
    [user_name]
  );

  return rows[0];
};