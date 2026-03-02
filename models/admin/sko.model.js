const { getDb } = require("../../db/connection");

const SkoModel = {
  create: async (data) => {
    const db = getDb();
    return db.query("INSERT INTO sko SET ?", data);
  },

  getByTo: async (to_id) => {
    const db = getDb();
    return db.query(
      `
      SELECT
        id,
        name,
        phone,
        email,
        center_name,
        wallet_balance
      FROM sko
      WHERE to_id = ?
      `,
      [to_id]
    );
  },

  updateById: async (id, data) => {
    const db = getDb();

    return db.query(
      `
      UPDATE sko
      SET
        name = ?,
        phone = ?,
        email = ?,
        center_name = ?,
        wallet_balance = ?
      WHERE id = ?
      `,
      [
        data.name,
        data.phone,
        data.email,
        data.center_name,
        data.wallet_balance,
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