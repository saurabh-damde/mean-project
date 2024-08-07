const Post = require("../models/post");

exports.getPosts = (req, res, nxt) => {
  const pageSize = +req.query.pageSize;
  const page = +req.query.page;
  let posts;
  const postQuery = Post.find();
  if (pageSize && page) {
    postQuery.skip(pageSize * (page - 1)).limit(pageSize);
  }
  postQuery
    .then((res) => {
      posts = res;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({ total: count, posts: posts });
    })
    .catch((err) =>
      res.status(500).json({
        message: "Fetching Posts Failed!",
      })
    );
};

exports.getPost = (req, res, nxt) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post Not Found!" });
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: "Fetching Post Failed!",
      })
    );
};

exports.createPost = (req, res, nxt) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.id,
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "New Post Added Successfully!",
        post: result,
      });
    })
    .catch((err) =>
      res.status(500).json({
        message: "Creating Post Failed!",
      })
    );
};

exports.updatePost = (req, res, nxt) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.id,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.id }, post)
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: "Post Updated Successfully!",
          post: result,
        });
      } else {
        res.status(401).json({
          message: "User Unauthorized!",
        });
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: "Couldn't update the Post!",
      })
    );
};

exports.deletePost = (req, res, nxt) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Post Deleted Successfully!",
          result: result,
        });
      } else {
        res.status(401).json({
          message: "User Unauthorized!",
        });
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: "Deleting Post Failed!",
      })
    );
};
