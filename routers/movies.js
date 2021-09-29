const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");

const { Movie } = require("../models/movie");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(".");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName[0]}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get("/", async (req, res) => {
  const movies = await Movie.find().select("-__v");

  if (!movies) {
    return res.status(500).send("Error fetching movies!");
  }

  res.send(movies);
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(500).send("Error fetching movie!");
    }

    res.send(movie);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/add-movie", uploadOptions.single("image"), (req, res) => {
  let movie;

  const file = req.file;
  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    movie = new Movie({
      title: req.body.title,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      rating: req.body.rating,
      description: req.body.description,
      richDescription: req.body.richDescription,
      isFeatured: req.body.isFeatured,
      image: `${basePath}${fileName}`,
    });
  } else {
    movie = new Movie({
      title: req.body.title,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      rating: req.body.rating,
      description: req.body.description,
      richDescription: req.body.richDescription,
      isFeatured: req.body.isFeatured,
    });
  }

  movie
    .save()
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

router.put(
  "/update-movie/:id",
  uploadOptions.single("image"),
  async (req, res) => {
    let movie;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Object ID!");
    }

    console.log(req.body);

    const file = req.file;
    if (file) {
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

      movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          genre: req.body.genre,
          releaseDate: req.body.releaseDate,
          rating: req.body.rating,
          description: req.body.description,
          richDescription: req.body.richDescription,
          isFeatured: req.body.isFeatured,
          image: `${basePath}${fileName}`,
        },
        { new: true }
      );
    } else {
      movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
    }

    if (!movie) {
      return res.status(500).send("Error updating movie!");
    }

    res.send(movie);
  }
);

router.put(
  "/add-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Object Id");
    }

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    let imagePaths = [];
    const files = req.files;

    if (files) {
      files.forEach((file) => {
        const filename = file.filename;
        imagePaths.push(`${basePath}${filename}`);
      });
    }
  }
);

router.delete("/delete-movie/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Object ID!");
  }

  const movieExists = await Movie.findById(req.params.id);
  if (!movieExists) {
    return res.status(400).send("The movie with this ID doesn't exists");
  }

  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) {
    return res.status(500).send("Error deleting movie!");
  }

  res.json({
    success: true,
    message: "The movie has been deleted successfully!",
  });
});

module.exports = router;
