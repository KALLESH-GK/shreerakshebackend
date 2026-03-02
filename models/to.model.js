const { getDb } = require("../db/connection");

exports.findByUsername = async (user_name) => {
  const db = getDb();

  const [rows] = await db.query(
    `SELECT * FROM to_user WHERE user_name = ? LIMIT 1`,
    [user_name]
  );

  return rows[0];
};