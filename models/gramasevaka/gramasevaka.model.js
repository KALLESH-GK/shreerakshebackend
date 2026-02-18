const { getDb } = require("../../db/connection");

/* ===============================
   GET GRAMASEVAKA PROFILE BY ID
================================ */
exports.getProfileById = async (id) => {
  const db = getDb();

  const [rows] = await db.query(
    `
    SELECT
      id,
      user_id,
      name,
      user_name,
      phone,
      user_type,
      dro_id,
      to_id,
      jsko_id,
      village,
      created_on
    FROM gramasevakas
    WHERE id = ?
    `,
    [id]
  );

  return rows[0];
};
