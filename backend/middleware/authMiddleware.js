
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  console.log("[AUTH CHECK] protect called:", req.method, req.originalUrl);
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

// Allows both logged-in customers and guests
const optionalProtect = (req, res, next) => {
  console.log("[AUTH CHECK] optionalProtect called:", req.method, req.originalUrl);
  try {
    const authHeader = req.headers.authorization;

    // No token means guest
    if (!authHeader) {
      return next();
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = { protect, optionalProtect };
