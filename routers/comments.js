const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Comment } = require("../models/comment");
const { Movie } = require("../models/movie");

router.get("/", async (req, res) => {
  const comments = await Comment.find()
    .populate("user", "name email")
    .populate("movieId", "title");

  if (!comments) {
    return res.status(500).send({ message: "Error fetching comments!" });
  }

  res.send(comments);
});

router.get("/get-comments/:id", async (req, res) => {
  try {
    let comments = await Comment.find({
      movieId: req.params.id,
    }).populate("user", "name email");

    if (!comments) {
      return res.status(500).send({ message: "Error fetching comments!" });
    }

    res.send(comments);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

router.post("/add-comment", async (req, res) => {
  let comment = new Comment({
    comment: req.body.comment,
    user: req.body.user,
    movieId: req.body.movieId,
  });

  try {
    const result = await comment.save();

    if (!result) {
      return res.status(500).send({ message: "Error adding comment!" });
    }

    res.send(result);
  } catch (err) {
    return res.send({ message: err });
  }
});

router.delete("/delete-comment/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send({ message: "Invalid Object ID!" });
  }

  const deletedComment = await Comment.findByIdAndRemove(req.params.id);

  try {
    if (!deletedComment) {
      return res.status(404).send({ message: "Comment not found!" });
    }

    res.send({ deletedComment, success: true });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

router.put("/edit-comment/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send({ message: "Invalid Object ID!" });
  }

  try {
    const result = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!result) {
      res.status(404).send({ message: "Cannot find comment!" });
    }
    res.status(200).send({
      message: "Comment updated successfully!",
      updatedComment: result,
    });
  } catch (err) {
    return res.status(500).send({ message: "Some error occured!" });
  }
});

module.exports = router;
