const jwt = require("jsonwebtoken");

exports.verify = (roles = []) => (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userRole = (
      decoded.role ||
      decoded.user_type ||
      ""
    ).toLowerCase();

    if (
      roles.length &&
      !roles.map(r => r.toLowerCase()).includes(userRole)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = {
      ...decoded,
      role: userRole,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired" });
  }
};