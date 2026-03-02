const { getDb } = require("../../db/connection");

/* ===============================
   DRO LEVEL
================================ */
exports.getDroReport = async (req, res) => {
  const db = getDb();
  const role = req.user.role;
  const userId = req.user.id;

  let query = `
    SELECT
      d.id,
      d.name,
      d.district,
      (
        SELECT COUNT(*)
        FROM applications a
        WHERE a.dro_id = d.id
          AND a.application_status = 'APPROVED'
      ) AS approved_applications
    FROM dro_users d
  `;

  if (role === "dro") {
    query += " WHERE d.id = ?";
    const [rows] = await db.query(query, [userId]);
    return res.json(rows);
  }

  const [rows] = await db.query(query);
  res.json(rows);
};

/* ===============================
   TOs UNDER DRO
================================ */
/* ===============================
   TOs UNDER DRO
================================ */
exports.getTosUnderDro = async (req, res) => {
  const db = getDb();
  const role = req.user.role;
  const userId = req.user.id;

  let droId = req.params.droId;

  // If DRO login → override droId
  if (role === "dro") {
    droId = userId;
  }

  const [rows] = await db.query(`
    SELECT
      t.id,
      t.name,
      t.phone,
      t.email,
      t.taluk,
      t.district,
      (
        SELECT COUNT(*)
        FROM applications a
        WHERE a.bdo_id = t.id
          AND a.application_status = 'APPROVED'
      ) AS approved_applications
    FROM to_user t
    WHERE t.dro_id = ?
  `, [droId]);

  res.json(rows);
};
/* ===============================
   JSKOs UNDER TO
================================ */
exports.getSkosUnderTo = async (req, res) => {
  const { toId } = req.params;
  const db = getDb();

  const [rows] = await db.query(`
    SELECT
      s.id,
      s.user_id,
      s.user_name,
      s.name,
      s.phone,
      s.email,
      s.center_name,
      s.wallet_balance,
      s.user_type,
      s.to_id,
      s.dro_id,

      (
        SELECT COUNT(*)
        FROM gramasevakas g
        WHERE g.jsko_id = s.id
      ) AS gramasevaka_count,

      (
        SELECT COUNT(*)
        FROM applications a
        WHERE a.created_by_jsko_id = s.id
          AND a.application_status = 'APPROVED'
      ) AS jsko_approved,

      (
        SELECT COUNT(*)
        FROM applications a
        WHERE a.created_by_gramasevaka_id IN (
          SELECT g.id FROM gramasevakas g WHERE g.jsko_id = s.id
        )
        AND a.application_status = 'APPROVED'
      ) AS gramasevaka_approved

    FROM sko s
    WHERE s.to_id = ?
  `, [toId]);

  res.json(rows);
};

/* ===============================
   GRAMASEVAKAS UNDER JSKO
================================ */

exports.getGramasevakasUnderSko = async (req, res) => {
  const { skoId } = req.params;
  const db = getDb();

  const [rows] = await db.query(`
    SELECT
      g.id,
      g.user_id,
      g.user_name,
      g.name,
      g.phone,
      g.village,
      g.user_type,
      g.dro_id,
      g.to_id,
      g.jsko_id,

      (
        SELECT COUNT(*)
        FROM applications a
        WHERE a.created_by_gramasevaka_id = g.id
      ) AS total_apps,

      (
        SELECT COUNT(*)
        FROM applications a
        WHERE a.created_by_gramasevaka_id = g.id
          AND a.application_status = 'SUBMITTED'
      ) AS pending_apps,

      (
        SELECT COUNT(*)
        FROM applications a
        WHERE a.created_by_gramasevaka_id = g.id
          AND a.application_status = 'APPROVED'
      ) AS approved_apps

    FROM gramasevakas g
    WHERE g.jsko_id = ?
  `, [skoId]);

  res.json(rows);
};

/* ===============================
   TO: JSKOs UNDER LOGGED IN TO
================================ */
exports.getSkosUnderLoggedInTo = async (req, res) => {
  try {
    const toId = req.user.id;
    const db = getDb();

    const [rows] = await db.query(`
      SELECT
        s.id,
        s.name,
        s.center_name,
        (
          SELECT COUNT(*)
          FROM applications a
          WHERE a.created_by_jsko_id = s.id
        ) AS total_apps
      FROM sko s
      WHERE s.to_id = ?
    `, [toId]);

    res.json(rows);

  } catch (err) {
    console.error("TO JSKO FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   TO: GRAMASEVAKAS UNDER JSKO
================================ */
exports.getGramasevakasUnderJskoForTo = async (req, res) => {
  try {
    const { skoId } = req.params;
    const db = getDb();

    const [rows] = await db.query(`
      SELECT
        g.id,
        g.name,
        g.village,
        (
          SELECT COUNT(*)
          FROM applications a
          WHERE a.created_by_gramasevaka_id = g.id
        ) AS total_apps
      FROM gramasevakas g
      WHERE g.jsko_id = ?
    `, [skoId]);

    res.json(rows);

  } catch (err) {
    console.error("GRAMASEVAKA FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};