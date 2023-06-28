// imports
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const connectDB = require("./database");
const moviesRoutes = require("./api/movies/movies.routes");
const actorRoutes = require("./api/actors/actors.routes");
const notFound = require("./middlewares/notFound");
const errorHandle = require("./middlewares/errorHandle");

// setup
const app = express();
connectDB();

// middlewares (before router)
app.use(morgan("dev"));
app.use(express.json());

// routes
app.use("/movies", moviesRoutes);
app.use("/actors", actorRoutes);

// middlewares (after router)
app.use(notFound);
app.use(errorHandle);

// run server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
