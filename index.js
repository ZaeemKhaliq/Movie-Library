const express = require("express");
const app = express();
require("dotenv/config");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const authJwt = require("./helpers/authJwt");
const errorHandler = require("./helpers/errorHandler");

app.use(cors());

//MIDDLEWARES

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//ROUTES
const API_URL = process.env.API_URL;

const movieRoutes = require("./routers/movies");
const authRoutes = require("./routers/auth");
const commentRoutes = require("./routers/comments");
app.use(`${API_URL}/movies`, movieRoutes);
app.use(`${API_URL}/auth`, authRoutes);
app.use(`${API_URL}/comments`, commentRoutes);

//SERVER INITIALIZATION
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("Listening on http://localhost:" + port);
});

//CONNECTION TO MONGODB
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected Successfully!");
  })
  .catch((err) => {
    console.log(err);
  });
