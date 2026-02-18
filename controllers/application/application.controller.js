const Application = require("../../models/application/application.model");
const cloudinary = require("cloudinary").v2;

/* ===============================
   CLOUDINARY CONFIG
================================ */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===============================
   CREATE APPLICATION
================================ */
exports.createApplication = async (req, res) => {
  try {
    const user = req.user;
    const body = req.body;

    /* ---------- VALIDATION ---------- */
    if (!/^\d{10}$/.test(body.aadhar_phone_number))
      return res.status(400).json({ message: "Phone must be 10 digits" });

    if (!/^\d{12}$/.test(body.aadhar_number))
      return res.status(400).json({ message: "Aadhaar must be 12 digits" });

    if (!/^\d{16}$/.test(body.card_number))
      return res.status(400).json({ message: "Card must be 16 digits" });

    if (await Application.isAadharExists(body.aadhar_number))
      return res.status(400).json({ message: "Aadhaar already exists" });

    if (await Application.isCardExists(body.card_number))
      return res.status(400).json({ message: "Card already exists" });

    if (!req.files?.adhar || !req.files?.photo)
      return res.status(400).json({ message: "Documents required" });

    /* ---------- CLOUDINARY ---------- */
    const adharUpload = await cloudinary.uploader.upload(
      req.files.adhar[0].path,
      { folder: "shreerakshe/aadhaar" }
    );

    const photoUpload = await cloudinary.uploader.upload(
      req.files.photo[0].path,
      { folder: "shreerakshe/photo" }
    );

    /* ---------- DATE ---------- */
    const issueDate = new Date(body.issue_date);
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(issueDate.getFullYear() + 1);
    expiryDate.setDate(expiryDate.getDate() - 1);

    /* ---------- BASE DATA ---------- */
    const appData = {
      application_id: "APP" + Date.now(),

      full_name: body.full_name,
      aadhar_number: body.aadhar_number,
      aadhar_phone_number: body.aadhar_phone_number,
      email: body.email,
      gender: body.gender,
      aadhar_address: body.aadhar_address,
      caste: body.caste,
      sub_caste: body.sub_caste,
      religion: body.religion,
      card_number: body.card_number,
      issue_place: body.issue_place,
      issue_date: issueDate,
      expiry_date: expiryDate,

      adhar_file: adharUpload.secure_url,
      photo_file: photoUpload.secure_url,
      application_fee: 354,
    };

    const role = (user.role || user.user_type || "").toLowerCase();

    /* ---------- SKO SUBMITS ---------- */
    if (role === "sko") {
      const map = await Application.getDroToFromSko(user.id);
      if (!map)
        return res.status(400).json({ message: "SKO record not found" });

      const wallet = await Application.getWallet(user.id);
      if (wallet < 354)
        return res.status(400).json({ message: "Insufficient wallet balance" });

      await Application.deductWallet(user.id, 354);

      appData.created_by_jsko_id = user.id;
      appData.dro_id = map.dro_id;
      appData.bdo_id = map.to_id;
      appData.application_status = "APPROVED";
    }

    /* ---------- GRAMASEVAKA SUBMITS ---------- */
    else if (role === "gramasevaka") {
      const map = await Application.getDroToFromGramasevaka(user.id);
      if (!map)
        return res.status(400).json({ message: "Gramasevaka record not found" });

      appData.created_by_gramasevaka_id = user.id;
      appData.dro_id = map.dro_id;
      appData.bdo_id = map.to_id;
      appData.application_status = "PENDING";
    }

    /* ---------- ADMIN SUBMITS (🔥 NEW) ---------- */
    else if (role === "admin") {
      // ❌ NO WALLET CUT
      appData.created_by_admin_id = user.id;
      appData.application_status = "APPROVED";
    }

    /* ---------- INVALID ROLE ---------- */
    else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    await Application.createApplication(appData);

    res.json({
      success: true,
      message: "Application submitted successfully",
    });

  } catch (err) {
    console.error("CREATE APPLICATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET APPLICATIONS BY GRAMASEVAKA (SKO VIEW)
================================ */
exports.getApplicationsByGramasevaka = async (req, res) => {
  try {
    const jskoId = req.user.id;
    const apps = await Application.getApplicationsByGramasevakas(jskoId);
    res.json(apps);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   UPDATE + APPROVE APPLICATION (SKO)
================================ */
exports.updateAndApproveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const jskoId = req.user.id;

    const app = await Application.getApplicationById(id);
    if (!app)
      return res.status(404).json({ message: "Application not found" });

    const allowed = await Application.isApplicationUnderJsko(id, jskoId);
    if (!allowed)
      return res.status(403).json({ message: "Not authorized" });

    const wallet = await Application.getWallet(jskoId);
    if (wallet < 354)
      return res.status(400).json({ message: "Insufficient wallet balance" });

    await Application.updateApplication(id, req.body);
    await Application.deductWallet(jskoId, 354);
    await Application.approveApplication(id);

    res.json({
      success: true,
      message: "Application updated & approved successfully",
    });

  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET MY APPLICATIONS (SKO)
================================ */
exports.getMyApplications = async (req, res) => {
  try {
    const jskoId = req.user.id;
    const apps = await Application.getMyApplications(jskoId);
    res.json(apps);
  } catch (err) {
    console.error("FETCH MY APPS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET MY APPLICATIONS (GRAMASEVAKA)
================================ */
exports.getMyGramasevakaApplications = async (req, res) => {
  try {
    const gramasevakaId = req.user.id;
    const apps = await Application.getMyGramasevakaApplications(gramasevakaId);
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   ADMIN: VIEW ALL APPLICATIONS
================================ */
exports.getAdminApplications = async (req, res) => {
  try {
    const [gramasevakas, skos, admins] = await Promise.all([
      Application.getApplicationsByGramasevakasAdmin(),
      Application.getApplicationsBySkoAdmin(),
      Application.getApplicationsByAdmin(),
    ]);

    res.json({
      gramasevakas,
      skos,
      admins,
    });
  } catch (err) {
    console.error("ADMIN FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ADMIN: UPDATE + APPROVE (ONCE)
================================ */
exports.adminUpdateAndApprove = async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Application.getApplicationById(id);
    if (!app)
      return res.status(404).json({ message: "Application not found" });

    if (app.application_status === "APPROVED")
      return res.status(400).json({ message: "Already approved" });

    await Application.updateApplication(id, req.body);
    await Application.approveApplication(id);

    res.json({
      success: true,
      message: "Application updated & approved successfully",
    });

  } catch (err) {
    console.error("ADMIN APPROVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ADMIN: UPDATE APPLICATION (NO WALLET, NO STATUS CHECK)
================================ */
/* ===============================
   ADMIN: UPDATE APPLICATION ONLY
================================ */
/* ===============================
   ADMIN: UPDATE ONLY
================================ */
/* ===============================
   ADMIN: UPDATE ONLY (NO APPROVE)
================================ */
exports.adminUpdateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Application.getApplicationById(id);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    await Application.updateApplication(id, req.body);

    res.json({
      success: true,
      message: "Application updated successfully by admin",
    });
  } catch (err) {
    console.error("ADMIN UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   DRO: MY APPLICATIONS
================================ */
exports.getDroApplications = async (req, res) => {
  try {
    const droId = req.user.id;

    const apps = await Application.getApplicationsByDro(droId);

    res.json(apps);
  } catch (err) {
    console.error("DRO APPLICATION FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   TO: MY APPLICATIONS
================================ */
exports.getToApplications = async (req, res) => {
  try {
    const toId = req.user.id;

    const apps = await Application.getApplicationsByTo(toId);

    res.json(apps);
  } catch (err) {
    console.error("TO APPLICATION FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};