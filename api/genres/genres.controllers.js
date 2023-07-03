const Genre = require("../../db/models/Genre");
const Movie = require("../../db/models/Movie");

exports.getGenre = async (req, res, next) => {
  try {
    const genres = await Genre.find().populate("movies", "title ");
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

    // const movieId = req.body.movies;

    // const movie = await Movie.findById(movieId);
    // if (!movie) {
    //   return res.status(404).json({ message: "Movie not found" });
    // }

    const { name } = req.body;
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res.status(400).json({ message: "Genre already exists" });
    }

    const newGenre = await Genre.create(req.body);

    // movie.genres.push(newGenre._id);
    // await movie.save();

    return res.status(201).json(newGenre);

    // const newGenre = await Genre.create(req.body);
    // return res.status(201).json(newGenre);
  } catch (error) {
    return next(error);
  }
};

exports.updateGenre = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      return res
        .status(403)
        .json({ message: "Only staff members can update genres" });
    }

    const { genreId } = req.params;
    const movieId = req.body.movies;

    let movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    const genre = await Genre.findById(genreId);
    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }
    const isGenreExist = movie.genres.includes(genre._id);
    if (isGenreExist) {
      return res
        .status(400)
        .json({ message: "Genre already added to the movie" });
    }
    // genre.name = req.body.name;
    genre.movies = [...genre.movies, movieId];

    movie.genres = [...movie.genres, genreId];

    await genre.save();
    await movie.save();

    return res.status(201).json(genre);
  } catch (error) {
    return next(error);
  }
};
