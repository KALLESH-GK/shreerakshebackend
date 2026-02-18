const { getDb } = require("../../db/connection");

exports.getProfileById = async (id) => {
  const db = getDb();

  const [rows] = await db.query(
    `
    SELECT
      id,
      user_id,
      user_name,
      name,
      phone,
      email,
      center_name,
      wallet_balance,
      user_type
    FROM sko
    WHERE id = ?
    `,
    [id]
  );

  return rows[0];
};
