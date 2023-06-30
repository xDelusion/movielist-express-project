const Genre = require("../../db/models/Genre");
const Movie = require("../../db/models/Movie");

exports.getGenre = async (req, res, next) => {
  try {
    const genres = await Genre.find().populate("movies");
    return res.status(201).json(genres);
  } catch (error) {
    return next(error);
  }
};

exports.addGenre = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      return res
        .status(403)
        .json({ message: "Only staff members can add genres" });
    }

    const movieId = req.body.movies;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const newGenre = await Genre.create({
      name: req.body.name,
      movies: [movieId],
    });

    movie.genre.push(newGenre._id);
    await movie.save();

    return res.status(201).json(newGenre);

    // const newGenre = await Genre.create(req.body);
    // return res.status(201).json(newGenre);
  } catch (error) {
    return next(error);
  }
};
