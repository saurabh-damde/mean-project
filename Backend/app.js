const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/post");
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

app.use((req, res, nxt) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  nxt();
});

app.get("/api/posts", (req, res, nxt) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => console.log(err));
});

app.post("/api/posts", (req, res, nxt) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((result) => {
    res.status(201).json({
      message: "New Post Added Successfully!",
      post: result,
    });
  });
});

app.delete("/api/posts/:id", (req, res, nxt) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({
      message: "Post Deleted Successfully!",
      result: result,
    });
  });
});

module.exports = app;
