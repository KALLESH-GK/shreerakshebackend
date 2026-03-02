const { getDb } = require("../../db/connection");

const DroModel = {
  create: async (data) => {
    const db = getDb();
    return db.query("INSERT INTO dro_users SET ?", data);
  },

  getAll: async () => {
    const db = getDb();
    // Only required fields
    return db.query(
      "SELECT id, name, phone, email, district FROM dro_users"
    );
  },

  updateById: async (id, data) => {
    const db = getDb();
    return db.query(
      `
      UPDATE dro_users
      SET
        name = ?,
        phone = ?,
        email = ?,
        district = ?
      WHERE id = ?
      `,
      [
        data.name,
        data.phone,
        data.email,
        data.district,
        id,
      ]
    );
  },

  deleteById: async (id) => {
    const db = getDb();
    return db.query("DELETE FROM dro_users WHERE id = ?", [id]);
  },
};

module.exports = DroModel;