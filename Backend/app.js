const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const user = require("./routes/user");
const posts = require("./routes/posts");

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.username}:${process.env.password}@${process.env.cluster}.wm8ui5a.mongodb.net/mean?w=majority&appName=${process.env.app}`
  )
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("Backend/images")));

app.use((req, res, nxt) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  nxt();
});
app.use("/api/user", user);
app.use("/api/posts", posts);

module.exports = app;
