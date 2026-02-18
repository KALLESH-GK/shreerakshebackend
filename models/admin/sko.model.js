const { getDb } = require("../../db/connection");

const SkoModel = {
  create: async (data) => {
    const db = getDb();
    return db.query("INSERT INTO sko SET ?", data);
  },

  getByTo: async (to_id) => {
    const db = getDb();
    return db.query(
      "SELECT id, user_name, name, phone, email, center_name FROM sko WHERE to_id = ?",
      [to_id]
    );
  },

  updateById: async (id, data) => {
    const db = getDb();

    return db.query(
      `
      UPDATE sko
      SET
        user_name = ?,
        name = ?,
        phone = ?,
        email = ?,
        center_name = ?
      WHERE id = ?
      `,
      [
        data.user_name,
        data.name,
        data.phone,
        data.email,
        data.center_name,
        id,
      ]
    );
  },

  deleteById: async (id) => {
    const db = getDb();
    return db.query("DELETE FROM sko WHERE id = ?", [id]);
  },
};

module.exports = SkoModel;

