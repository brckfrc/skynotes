const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401);
    
    // Support both new sanitized payload ({ userId, email }) and legacy payload ({ user: { _id, ... } })
    const userId = decoded.userId || (decoded.user && decoded.user._id);
    const email = decoded.email || (decoded.user && decoded.user.email);
    
    if (!userId) return res.sendStatus(401);

    req.user = { _id: userId, email };
    next();
  });
}

module.exports = {
  authenticateToken,
};

