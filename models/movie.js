const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  description: {
    type: String,
  },
  richDescription: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: "",
  },
  images: [
    {
      type: String,
    },
  ],
});

movieSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

movieSchema.set("toJSON", {
  virtuals: true,
});

exports.Movie = mongoose.model("Movie", movieSchema);
