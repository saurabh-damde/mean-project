const express = require("express");

const Post = require("../models/post");

const router = express.Router();

router.get("", (req, res, nxt) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => console.log(err));
});

router.get("/:id", (req, res, nxt) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post Not Found!" });
    }
  });
});

router.post("", (req, res, nxt) => {
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

router.put("/:id", (req, res, nxt) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({
      message: "Post Updated Successfully!",
      post: result,
    });
  });
});

router.delete("/:id", (req, res, nxt) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({
      message: "Post Deleted Successfully!",
      result: result,
    });
  });
});

module.exports = router;
