// imports
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const { localStrategy } = require("./middlewares/passport");
require("dotenv").config();
const connectDB = require("./database");
const cors = require("cors");
const moviesRoutes = require("./api/movies/movies.routes");
const actorRoutes = require("./api/actors/actors.routes");
const authRoutes = require("./api/auth/auth.routes");
const genreRoutes = require("./api/genres/genres.routes");

const notFound = require("./middlewares/notFound");
const errorHandle = require("./middlewares/errorHandle");

// setup
const app = express();
connectDB();

// middlewares (before router)
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use(localStrategy);

// routes
app.use("/movies", moviesRoutes);
app.use("/actors", actorRoutes);
app.use("/auth", authRoutes);
app.use("/genres", genreRoutes);

// middlewares (after router)
app.use(notFound);
app.use(errorHandle);

// run server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
