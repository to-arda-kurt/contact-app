const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //GET token from header

  const token = req.header("x-auth-token");

  //CHECK If not token
  if (!token) {
    res.status(401).json({ msg: "No token auth denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "token is not valid" });
  }
};
