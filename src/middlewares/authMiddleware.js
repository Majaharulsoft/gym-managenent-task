const jwt = require('jsonwebtoken');

const authMiddleware = function (req, res, next) {
  // Extract the token from the Authorization header (Bearer token)
  const authHeader = req.header("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access: No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded token to req.user
    req.user = decoded;
    next();
  } catch (err) {
    // Handle any token verification errors
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

module.exports = authMiddleware;
