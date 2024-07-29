const express = require("express");
const multer = require("multer");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cbf) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error("Invalid mime type");
    if (isValid) {
      err = null;
    }
    cbf(err, "Backend/images");
  },
  filename: (req, file, cbf) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cbf(null, name + "-" + Date.now() + "." + ext);
  },
});

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

router.post("", multer({ storage }).single("image"), (req, res, nxt) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
  });
  post.save().then((result) => {
    res.status(201).json({
      message: "New Post Added Successfully!",
      post: result,
    });
  });
});

router.put("/:id", multer({ storage }).single("image"), (req, res, nxt) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath: url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
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
