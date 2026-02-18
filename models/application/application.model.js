const { getDb } = require("../../db/connection");

/* ===============================
   CHECK AADHAAR EXISTS
================================ */
exports.isAadharExists = async (aadhar) => {
  const db = getDb();
  const [rows] = await db.execute(
    "SELECT id FROM applications WHERE aadhar_number = ?",
    [aadhar]
  );
  return rows.length > 0;
};

/* ===============================
   CHECK CARD EXISTS
================================ */
exports.isCardExists = async (card) => {
  const db = getDb();
  const [rows] = await db.execute(
    "SELECT id FROM applications WHERE card_number = ?",
    [card]
  );
  return rows.length > 0;
};

/* ===============================
   FETCH DRO & TO FROM SKO
================================ */
exports.getDroToFromSko = async (skoId) => {
  const db = getDb();
  const [rows] = await db.execute(
    "SELECT dro_id, to_id FROM sko WHERE id = ?",
    [skoId]
  );
  return rows[0];
};

/* ===============================
   FETCH DRO & TO FROM GRAMASEVAKA
================================ */
exports.getDroToFromGramasevaka = async (gId) => {
  const db = getDb();
  const [rows] = await db.execute(
    "SELECT dro_id, to_id FROM gramasevakas WHERE id = ?",
    [gId]
  );
  return rows[0];
};

/* ===============================
   GET SKO WALLET
================================ */
exports.getWallet = async (skoId) => {
  const db = getDb();
  const [[row]] = await db.execute(
    "SELECT wallet_balance FROM sko WHERE id = ?",
    [skoId]
  );
  return row.wallet_balance;
};

/* ===============================
   DEDUCT SKO WALLET
================================ */
exports.deductWallet = async (skoId, amount) => {
  const db = getDb();
  await db.execute(
    "UPDATE sko SET wallet_balance = wallet_balance - ? WHERE id = ?",
    [amount, skoId]
  );
};

/* ===============================
   CREATE APPLICATION  ✅ FIXED
================================ */
exports.createApplication = async (data) => {
  const db = getDb();

  const sql = `
    INSERT INTO applications (
      application_id,

      created_by_jsko_id,
      created_by_gramasevaka_id,
      created_by_admin_id,

      dro_id,
      bdo_id,

      card_number,
      full_name,
      aadhar_number,
      aadhar_phone_number,
      email,
      aadhar_address,
      caste,
      sub_caste,
      religion,
      issue_place,
      issue_date,
      expiry_date,

      adhar_file,
      photo_file,
      application_status,
      application_fee,
      gender
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.application_id,

    data.created_by_jsko_id ?? null,
    data.created_by_gramasevaka_id ?? null,
    data.created_by_admin_id ?? null,

    data.dro_id ?? null,
    data.bdo_id ?? null,

    data.card_number,
    data.full_name,
    data.aadhar_number,
    data.aadhar_phone_number,
    data.email,
    data.aadhar_address,
    data.caste,
    data.sub_caste,
    data.religion,
    data.issue_place,
    data.issue_date,
    data.expiry_date,

    data.adhar_file,
    data.photo_file,
    data.application_status,
    data.application_fee,
    data.gender,
  ];

  const [result] = await db.execute(sql, values);
  return result.insertId;
};

/* ===============================
   GET APPLICATION BY ID
================================ */
exports.getApplicationById = async (id) => {
  const db = getDb();
  const [rows] = await db.execute(
    "SELECT * FROM applications WHERE id = ?",
    [id]
  );
  return rows[0];
};

/* ===============================
   GET GRAMASEVAKA APPLICATIONS (SKO VIEW)
================================ */
exports.getApplicationsByGramasevakas = async (jskoId) => {
  const db = getDb();
  const [rows] = await db.execute(
    `
    SELECT a.*
    FROM applications a
    JOIN gramasevakas g
      ON a.created_by_gramasevaka_id = g.id
    WHERE g.jsko_id = ?
    ORDER BY a.created_on DESC
    `,
    [jskoId]
  );
  return rows;
};

/* ===============================
   SECURITY CHECK
================================ */
exports.isApplicationUnderJsko = async (appId, jskoId) => {
  const db = getDb();
  const [rows] = await db.execute(
    `
    SELECT 1
    FROM applications a
    JOIN gramasevakas g
      ON a.created_by_gramasevaka_id = g.id
    WHERE a.id = ? AND g.jsko_id = ?
    `,
    [appId, jskoId]
  );
  return rows.length > 0;
};

/* ===============================
   UPDATE APPLICATION
================================ */
exports.updateApplication = async (id, data) => {
  const db = getDb();
  await db.execute(
    `
    UPDATE applications SET
      full_name = ?,
      aadhar_number = ?,
      aadhar_phone_number = ?,
      card_number = ?,
      email = ?,
      gender = ?,
      aadhar_address = ?,
      caste = ?,
      sub_caste = ?,
      religion = ?,
      issue_place = ?,
      issue_date = ?
    WHERE id = ?
    `,
    [
      data.full_name,
      data.aadhar_number,
      data.aadhar_phone_number,
      data.card_number,
      data.email,
      data.gender,
      data.aadhar_address,
      data.caste,
      data.sub_caste,
      data.religion,
      data.issue_place,
      data.issue_date,
      id,
    ]
  );
};

/* ===============================
   APPROVE APPLICATION
================================ */
exports.approveApplication = async (id) => {
  const db = getDb();
  await db.execute(
    "UPDATE applications SET application_status = 'APPROVED' WHERE id = ?",
    [id]
  );
};

/* ===============================
   MY APPLICATIONS (SKO)
================================ */
exports.getMyApplications = async (jskoId) => {
  const db = getDb();
  const [rows] = await db.execute(
    "SELECT * FROM applications WHERE created_by_jsko_id = ?",
    [jskoId]
  );
  return rows;
};

exports.getMyGramasevakaApplications = async (gId) => {
  const db = getDb();
  const [rows] = await db.execute(
    "SELECT * FROM applications WHERE created_by_gramasevaka_id = ?",
    [gId]
  );
  return rows;
};


/* ===============================
   ADMIN: APPLICATIONS BY GRAMASEVAKAS
================================ */
exports.getApplicationsByGramasevakasAdmin = async () => {
  const db = getDb();
  const [rows] = await db.execute(
    `
    SELECT *
    FROM applications
    WHERE created_by_gramasevaka_id IS NOT NULL
    ORDER BY created_on DESC
    `
  );
  return rows;
};

/* ===============================
   ADMIN: APPLICATIONS BY SKO
================================ */
exports.getApplicationsBySkoAdmin = async () => {
  const db = getDb();
  const [rows] = await db.execute(
    `
    SELECT *
    FROM applications
    WHERE created_by_jsko_id IS NOT NULL
    ORDER BY created_on DESC
    `
  );
  return rows;
};

/* ===============================
   ADMIN: APPLICATIONS BY ADMIN
================================ */
exports.getApplicationsByAdmin = async () => {
  const db = getDb();
  const [rows] = await db.execute(
    `
    SELECT *
    FROM applications
    WHERE created_by_admin_id IS NOT NULL
    ORDER BY created_on DESC
    `
  );
  return rows;
};

/* ===============================
   DRO: APPLICATIONS
================================ */
exports.getApplicationsByDro = async (droId) => {
  const db = getDb();

  const [rows] = await db.execute(
    `
    SELECT *
    FROM applications
    WHERE dro_id = ?
    ORDER BY created_on DESC
    `,
    [droId]
  );

  return rows;
};

/* ===============================
   TO: APPLICATIONS
================================ */
exports.getApplicationsByTo = async (toId) => {
  const db = getDb();

  const [rows] = await db.execute(
    `
    SELECT *
    FROM applications
    WHERE bdo_id = ?
    ORDER BY created_on DESC
    `,
    [toId]
  );

  return rows;
};