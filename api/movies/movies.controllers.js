const Movie = require("../../db/models/Movie");

exports.movieGet = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    return next(error);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const newMovie = await Movie.create(req.body);
    return res.status(201).json(newMovie);
  } catch (error) {
    return next(error);
  }
};
