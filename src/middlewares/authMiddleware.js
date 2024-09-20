var jwt = require('jsonwebtoken');

var authMiddleware = function (req, res, next) {
  var token = req.header("Authorization") ? req.header("Authorization").split(" ")[1] : null;
  if (!token) return res.status(401).json({ message: "Unauthorized access" });

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token to req.user
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
