const Actor = require("../../db/models/Actor");
const Genre = require("../../db/models/Genre");
const Movie = require("../../db/models/Movie");
const MovieReview = require("../../db/models/MovieReview");
const User = require("../../db/models/User");

exports.getMovie = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 3; // Number of movies per page
    const count = await Movie.countDocuments(); // Total count of movies
    const totalPages = Math.ceil(count / limit); // Total number of pages
    const skip = (page - 1) * limit; // Number of movies to skip

    const movies = await Movie.find()
      .skip(skip)
      .limit(limit)
      .populate("genres", "-_id name")
      .populate("reviews", "-movieId")
      .populate("actors.actor", "name");

    return res.status(200).json({
      movies,
      page,
      totalPages,
      totalCount: count,
    });
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

    // const actorId = req.body.actors;
    // const actor = await Actor.findById(actorId);
    // if (!actor) {
    //   return res.status(404).json({ message: "Actor not found" });
    // }

    const { title } = req.body;

    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(400).json({ message: "Movie already exists" });
    }

    const newMovie = await Movie.create(req.body);

    // newMovie.actors.push(actor._id);
    await newMovie.save();
    return res.status(201).json(newMovie);
  } catch (error) {
    return next(error);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      return res
        .status(403)
        .json({ message: "Only staff members can add movies" });
    }

    const { movieId } = req.params;
    const actorId = req.body.actors;

    let movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    if (actorId) {
      const actor = await Actor.findById(actorId);
      if (!actor) {
        return res.status(404).json({ message: "Actor not found" });
      }
      // Check if actor already exists in the movie
      const isActorExist = movie.actors.includes(actor._id);
      if (isActorExist) {
        return res
          .status(400)
          .json({ message: "Actor already added to the movie" });
      }
      movie.actors = [...movie.actors, actorId];
    }

    // const genre = await Genre.findById(genreId);
    // if (!genre) {
    //   return res.status(404).json({ message: "Genre not found" });
    // }
    let genres = req.body.genres;

    if (genres) {
      let genre = await Genre.findOne({ name: genres });
      if (!genre) {
        return res.status(404).json({ message: "Genre not found" });
      }
      // Check if genre already exists in the movie
      const isGenreExist = movie.genres.includes(genre._id);
      if (isGenreExist) {
        return res
          .status(400)
          .json({ message: "Genre already added to the movie" });
      }
      movie.genres = [...movie.genres, genre._id];
    }

    // movie.title = req.body.title;
    // movie.releaseDate = req.body.releaseDate;
    // movie.actors.push(...actorId);
    // newMovie.actors.push(actor._id);
    await movie.save();
    return res.status(201).json(movie);
  } catch (error) {
    return next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      return res
        .status(403)
        .json({ message: "Only staff members can delete movies" });
    }

    const { movieId } = req.params;

    let movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.status(200).json({ message: "Movie deleted successfully" });
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

    const existingMovie = await User.findOne({
      _id: req.user._id,
      "watchlist.movie": newMovie._id,
    });

    if (existingMovie) {
      return res
        .status(400)
        .json({ message: "You have already added this movie" });
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

    movie.watched = true;
    await req.user.save();

    return res.status(200).json({ message: "Movie marked as watched" });
  } catch (error) {
    return next(error);
  }
};
