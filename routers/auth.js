const express = require("express");
const router = express.Router();

const { hashSync, compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");
const { Role } = require("../models/role");

router.get("/", async (req, res) => {
  const usersList = await User.find().populate("role");

  if (!usersList) {
    return res.status(500).send("Error fetching users!");
  }

  res.send(usersList);
});

router.post("/signup", async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists) {
    return res.status(406).send("A user with this email already exists!");
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashSync(req.body.password, 10),
    role: req.body.role,
  });

  const result = await user.save();

  if (!result) {
    return res.status(500).send("Some error occured while creating user!");
  }

  res.send(result);
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate("role");
    console.log(user);

    if (!user) {
      return res
        .status(404)
        .send({ message: "The user with this email does not exists!" });
    }

    if (user && compareSync(req.body.password, user.password)) {
      const secret = process.env.SECRET_KEY;

      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: req.body.email == "johndoe@example.com" ? true : false,
        },
        secret,
        {
          expiresIn: "1d",
        }
      );
      return res.send({
        user: {
          email: user.email,
          name: user.name,
          role: user.role.name,
          userId: user.id,
        },
        token: token,
      });
    } else {
      return res
        .status(404)
        .send({ message: "You have entered wrong password!" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({
        message: "Some error has occured in processing your request!",
        error: err,
      });
  }
});

module.exports = router;
