const Movie = require("../../db/models/Movie");
const MovieReview = require("../../db/models/MovieReview");

exports.getMovie = async (req, res, next) => {
  try {
    const movies = await Movie.find()
      .populate("genre", "name -_id")
      .populate("reviews", "-movieId");
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

    // Conditions for the review and rating
    const { rating, review } = req.body;

    if (rating < 1 || rating > 10) {
      return res
        .status(400)
        .json({ message: "Rating should be between 1 and 10" });
    }

    if (review.length < 10) {
      return res
        .status(400)
        .json({ message: "Review should be longer than 10 characters" });
    }

    // Check if the user has already reviewed the movie
    const existingReview = await MovieReview.findOne({
      movieId: movie.id,
      userId: req.user._id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this movie" });
    }

    const newReview = await MovieReview.create({
      rating: req.body.rating,
      review: req.body.review,
      addedBy: req.user.username,
      userId: req.user._id,
      movieId: movieId,
    });
    console.log(req.user);
    movie.reviews.push(newReview);
    await movie.save();
    return res.status(201).json(newReview);
  } catch (error) {
    return next(error);
  }
};
