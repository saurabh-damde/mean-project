const express = require("express");

const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const file = require("../middleware/file");

const router = express.Router();

router.get("", getPosts);

router.get("/:id", getPost);

router.post("", checkAuth, file, createPost);

router.put("/:id", checkAuth, file, updatePost);

router.delete("/:id", checkAuth, deletePost);

module.exports = router;
