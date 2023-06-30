const Movie = require("../../db/models/Movie");
const MovieReview = require("../../db/models/MovieReview");

exports.getMovie = async (req, res, next) => {
  try {
    const movies = await Movie.find()
      .populate("genre", "name -_id")
      .populate("reviews");
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

exports.reviewMovie = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Only users can review movies" });
    }

    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const newReview = await MovieReview.create({
      rating: req.body.rating,
      review: req.body.review,
      userId: req.user._id,
      movieId: movieId,
    });

    movie.reviews.push(newReview);
    await movie.save();
    return res.status(201).json(newReview);
  } catch (error) {
    return next(error);
  }
};
