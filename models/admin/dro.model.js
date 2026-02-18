const { getDb } = require("../../db/connection");

const DroModel = {
  create: async (data) => {
    const db = getDb();
    return db.query("INSERT INTO dro_users SET ?", data);
  },

  getAll: async () => {
    const db = getDb();
    return db.query("SELECT * FROM dro_users");
  },

  updateById: async (id, data) => {
    const db = getDb();
    return db.query("UPDATE dro_users SET ? WHERE id = ?", [data, id]);
  },

  deleteById: async (id) => {
    const db = getDb();
    return db.query("DELETE FROM dro_users WHERE id = ?", [id]);
  },
};

module.exports = DroModel;
