const jwt = require("jsonwebtoken");

module.exports = (req, res, nxt) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // "Bearer {TOKEN}"
    jwt.verify(token, "this_is_a_secret");
    nxt();
  } catch (err) {
    res.status(401).json({
      message: "Authorization Failed!",
    });
  }
};
