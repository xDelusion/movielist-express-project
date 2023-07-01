const Movie = require("../../db/models/Movie");
const MovieReview = require("../../db/models/MovieReview");
const User = require("../../db/models/User");

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
      movieId: movie._id,
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

    movie.reviews.push(newReview);

    // Calculate the average rating
    const reviews = await MovieReview.find({ movieId: movie._id });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    movie.avgRating = avgRating;

    await movie.save();
    return res.status(201).json(newReview);
  } catch (error) {
    return next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(403)
        .json({ message: "Only members can add movies to watchlist" });
    }

    const { movieId } = req.params;

    const newMovie = await Movie.findById(movieId);
    if (!newMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    req.user.watchlist.push({
      movie: newMovie._id,
      watched: false,
    });

    await req.user.save();
    return res.status(201).json(newMovie);
  } catch (error) {
    return next(error);
  }
};

exports.getWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("watchlist.movie", "title")
      .select("watchlist");

    return res.json(user.watchlist);
  } catch (error) {
    return next(error);
  }
};

exports.updateWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const movie = req.user.watchlist.find((item) => item.movie.equals(movieId));
    if (!movie) {
      return res.status(404).json({ message: "Movie not found in watchlist" });
    }
    console.log(movie);

    movie.watched = true;
    await req.user.save();

    return res.status(200).json({ message: "Movie marked as watched" });
  } catch (error) {
    return next(error);
  }
};
