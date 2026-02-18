const { getDb } = require("../db/connection");

exports.login = async (user_name, user_password) => {
  const db = getDb();
  const [rows] = await db.query(
    `SELECT id, user_id, user_name, user_type, dro_id, to_id 
     FROM sko 
     WHERE user_name=? AND user_password=? 
     LIMIT 1`,
    [user_name, user_password]
  );
  return rows[0];
};
