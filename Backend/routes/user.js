const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/login", (req, res, nxt) => {
  const { email, password } = req.body;
  let userData;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication Failed!",
        });
      }
      userData = user;
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication Failed!",
        });
      }
      const token = jwt.sign(
        { email: userData.email, id: userData._id },
        "this_is_a_secret",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: userData._id,
      });
    })
    .catch((err) =>
      res.status(401).json({
        message: "Authentication Failed!",
        error: err,
      })
    );
});

router.post("/signup", (req, res, nxt) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      email: email,
      password: hash,
    });
    user
      .save()
      .then((result) =>
        res.status(200).json({
          message: "User Created!",
          user: result,
        })
      )
      .catch((err) =>
        res.status(500).json({
          error: err,
        })
      );
  });
});

module.exports = router;
