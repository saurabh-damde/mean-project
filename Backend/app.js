const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const posts = [
  { id: "1", title: "Title 1", content: "Content 1" },
  { id: "2", title: "Title 2", content: "Content 2" },
  { id: "3", title: "Title 3", content: "Content 3" },
];

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
  res.status(200).json(posts);
});

app.post("/api/posts", (req, res, nxt) => {
  const post = req.body;
  posts.push(post);
  res.status(201).json({
    message: "New Post Added Successfully!",
    post: post,
  });
});

module.exports = app;
