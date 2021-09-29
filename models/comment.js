const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },
});

commentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

commentSchema.set("toJSON", {
  virtuals: true,
});

exports.Comment = mongoose.model("Comment", commentSchema);
