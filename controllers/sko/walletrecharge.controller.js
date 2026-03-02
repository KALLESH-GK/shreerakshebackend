const WalletRecharge = require("../../models/sko/walletrecharge.model");
const cloudinary = require("cloudinary").v2;
const { getDb } = require("../../db/connection");

/* ===============================
   CLOUDINARY CONFIG
================================ */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===============================
   SKO → CREATE WALLET RECHARGE
================================ */
exports.createRecharge = async (req, res) => {
  try {
    const user = req.user;
    const { amount, utr_number } = req.body;

    /* ---------- VALIDATION ---------- */
    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Amount is required" });

    if (!utr_number)
      return res.status(400).json({ message: "UTR number is required" });

    if (!req.file)
      return res.status(400).json({ message: "Screenshot is required" });

    /* 🔥 CHECK DUPLICATE UTR */
    const existingUtr = await WalletRecharge.getRechargeByUtr(utr_number);

    if (existingUtr) {
      return res.status(400).json({
        message: "UTR number already exists",
      });
    }

    /* 🔥 FETCH SKO NAME */
    const skoName = await WalletRecharge.getSkoNameById(user.id);

    if (!skoName)
      return res.status(400).json({ message: "SKO name not found" });

    /* ---------- CLOUDINARY ---------- */
    const uploadResult = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "shreerakshe/wallet-recharge" }
    );

    /* ---------- INSERT ---------- */
    await WalletRecharge.createRecharge({
      recharge_id: "RCG" + Date.now(),
      jsko_id: user.id,
      jsko_name: skoName,
      amount: Number(amount),
      utr_number,
      screenshot: uploadResult.secure_url,
      status: "PENDING",
    });

    res.json({
      success: true,
      message: "Recharge request submitted successfully",
    });

  } catch (err) {
    console.error("CREATE RECHARGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   SKO → GET MY RECHARGES
================================ */
exports.getMyRecharges = async (req, res) => {
  try {
    const jskoId = req.user.id;
    const data = await WalletRecharge.getMyRecharges(jskoId);
    res.json(data);
  } catch (err) {
    console.error("GET MY RECHARGES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveRecharge = async (req, res) => {
  const pool = getDb();
  const { id } = req.params;

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await WalletRecharge.approveRechargeWithTransaction(connection, id);

    await connection.commit();

    res.json({
      success: true,
      message: "Recharge approved and wallet updated",
    });

  } catch (err) {
    if (connection) await connection.rollback();

    if (err.message === "RECHARGE_NOT_FOUND") {
      return res.status(404).json({ message: "Recharge not found" });
    }

    if (err.message === "ALREADY_APPROVED") {
      return res.status(400).json({ message: "Recharge already approved" });
    }

    console.error("APPROVE RECHARGE ERROR:", err);
    res.status(500).json({ message: "Server error" });

  } finally {
    if (connection) connection.release();
  }
};

/* ===============================
   ADMIN → GET ALL WALLET RECHARGES
================================ */
exports.getAllRecharges = async (req, res) => {
  try {
    const data = await WalletRecharge.getAllRecharges();
    res.json(data);
  } catch (err) {
    console.error("GET ALL RECHARGES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


