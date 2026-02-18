const { getDb } = require("../../db/connection");

const ToModel = {
  create: async (data) => {
    const db = getDb();
    return db.query("INSERT INTO to_user SET ?", data);
  },

  getByDro: async (dro_id) => {
    const db = getDb();
    return db.query(
      "SELECT id, user_name, name, phone, email, taluk, district FROM to_user WHERE dro_id = ?",
      [dro_id]
    );
  },

  updateById: async (id, data) => {
    const db = getDb();

    return db.query(
      `
      UPDATE to_user
      SET
        user_name = ?,
        name = ?,
        phone = ?,
        email = ?,
        taluk = ?,
        district = ?
      WHERE id = ?
      `,
      [
        data.user_name,
        data.name,
        data.phone,
        data.email,
        data.taluk,
        data.district,
        id,
      ]
    );
  },

  deleteById: async (id) => {
    const db = getDb();
    return db.query("DELETE FROM to_user WHERE id = ?", [id]);
  },
};

module.exports = ToModel;