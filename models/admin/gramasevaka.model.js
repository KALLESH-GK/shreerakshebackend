const { getDb } = require("../../db/connection");

const GramasevakaModel = {
  create: async (data) => {
    const db = getDb();
    return db.query("INSERT INTO gramasevakas SET ?", data);
  },

  getBySko: async (jsko_id) => {
    const db = getDb();
    return db.query(
      `
      SELECT
        id,
        name,
        phone,
        email,
        village
      FROM gramasevakas
      WHERE jsko_id = ?
      `,
      [jsko_id]
    );
  },

 updateById: async (id, data) => {
  const db = getDb();

  return db.query(
    `
    UPDATE gramasevakas
    SET
      name = ?,
      phone = ?,
      village = ?
    WHERE id = ?
    `,
    [data.name, data.phone, data.village, id]
  );
},

  deleteById: async (id) => {
    const db = getDb();
    return db.query("DELETE FROM gramasevakas WHERE id = ?", [id]);
  },
};

module.exports = GramasevakaModel;
