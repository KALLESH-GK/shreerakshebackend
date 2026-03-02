const { getDb } = require("../../db/connection");

exports.createRecharge = async (data) => {
  const db = getDb();

  const [result] = await db.query(
    `
    INSERT INTO walletrecharge (
      recharge_id,
      jsko_id,
      jsko_name,
      amount,
      utr_number,
      screenshot,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.recharge_id,
      data.jsko_id,
      data.jsko_name,
      data.amount,
      data.utr_number,
      data.screenshot,
      data.status,
    ]
  );

  return result;
};

exports.getMyRecharges = async (jskoId) => {
  const db = getDb();

  const [rows] = await db.query(
    `
    SELECT *
    FROM walletrecharge
    WHERE jsko_id = ?
    ORDER BY created_on DESC
    `,
    [jskoId]
  );

  return rows;
};

exports.getRechargeById = async (id) => {
  const db = getDb();

  const [rows] = await db.query(
    `SELECT * FROM walletrecharge WHERE id = ?`,
    [id]
  );

  return rows[0];
};

exports.approveRecharge = async (id) => {
  const db = getDb();

  await db.query(
    `
    UPDATE walletrecharge
    SET status = 'APPROVED'
    WHERE id = ?
    `,
    [id]
  );
};

exports.addWalletBalance = async (jskoId, amount) => {
  const db = getDb();

  await db.query(
    `
    UPDATE sko
    SET wallet_balance = wallet_balance + ?
    WHERE id = ?
    `,
    [amount, jskoId]
  );
};
exports.getSkoNameById = async (jskoId) => {
  const db = getDb();

  const [rows] = await db.query(
    `
    SELECT name
    FROM sko
    WHERE id = ?
    `,
    [jskoId]
  );

  return rows[0]?.name;
};

exports.getAllRecharges = async () => {
  const db = getDb();

  const [rows] = await db.query(`
    SELECT 
      wr.*,
      s.user_name AS jsko_username
    FROM walletrecharge wr
    JOIN sko s ON s.id = wr.jsko_id
    ORDER BY wr.created_on DESC
  `);

  return rows;
};


exports.approveRechargeWithTransaction = async (connection, rechargeId) => {
  /* ---------- GET RECHARGE ---------- */
  const [[recharge]] = await connection.query(
    `SELECT * FROM walletrecharge WHERE id = ? FOR UPDATE`,
    [rechargeId]
  );

  if (!recharge) {
    throw new Error("RECHARGE_NOT_FOUND");
  }

  if (recharge.status === "APPROVED") {
    throw new Error("ALREADY_APPROVED");
  }

  /* ---------- ADD WALLET BALANCE ---------- */
  await connection.query(
    `
    UPDATE sko
    SET wallet_balance = wallet_balance + ?
    WHERE id = ?
    `,
    [recharge.amount, recharge.jsko_id]
  );

  /* ---------- UPDATE RECHARGE STATUS ---------- */
  await connection.query(
    `
    UPDATE walletrecharge
    SET status = 'APPROVED'
    WHERE id = ?
    `,
    [rechargeId]
  );

  return recharge;
};

exports.getRechargeByUtr = async (utrNumber) => {
  const db = getDb();

  const [rows] = await db.query(
    `SELECT id FROM walletrecharge WHERE utr_number = ?`,
    [utrNumber]
  );

  return rows[0];
};