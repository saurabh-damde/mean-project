const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const posts = require("./routes/posts");
const cred = require("./db.json"); // Needs to be created with the credential data.

const app = express();

mongoose
  .connect(
    `mongodb+srv://${cred.username}:${cred.password}@mazino.wm8ui5a.mongodb.net/mean?retryWrites=true&w=majority&appName=${cred.app}`
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
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  nxt();
});

app.use("/api/posts", posts);

module.exports = app;
