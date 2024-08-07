const jwt = require("jsonwebtoken");

module.exports = (req, res, nxt) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // "Bearer {TOKEN}"
    const deToken = jwt.verify(token, process.env.jwt);
    req.userData = { email: deToken.email, id: deToken.id };
    nxt();
  } catch (err) {
    res.status(401).json({
      message: "You are not authorized!",
    });
  }
};
