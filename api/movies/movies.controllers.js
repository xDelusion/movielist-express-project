const Movie = require("../../db/models/Movie");

exports.getMovie = async (req, res, next) => {
  try {
    const movies = await Movie.find().populate("genre", "name -_id");
    res.json(movies);
  } catch (error) {
    return next(error);
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      return res
        .status(403)
        .json({ message: "Only staff members can add movies" });
    }
    const newMovie = await Movie.create(req.body);
    return res.status(201).json(newMovie);
  } catch (error) {
    return next(error);
  }
};
