const Actor = require("../../db/models/Actor");
const Movie = require("../../db/models/Movie");

exports.getActor = async (req, res, next) => {
  try {
    const actors = await Actor.find().populate("movies", "title");

    return res.status(200).json(actors);
  } catch (error) {
    return next(error);
  }
};

exports.addActor = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      return res
        .status(403)
        .json({ message: "Only staff members can add actors" });
    }

    const movieId = req.body.movies;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if the actor already exists
    const { name } = req.body;
    const existingActor = await Actor.findOne({ name });

    if (existingActor) {
      return res.status(400).json({ message: "Actor already exists" });
    }
    const newActor = await Actor.create({ name });

    // movie.actors.push(newActor._id);

    newActor.movies = [...newActor.movies, movieId];
    movie.actors = [...movie.actors, newActor];

    await movie.save();
    await newActor.save();

    return res.status(201).json(newActor);
  } catch (error) {
    return next(error);
  }
};

exports.updateActor = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      return res
        .status(403)
        .json({ message: "Only staff members can update genres" });
    }

    const { actorId } = req.params;
    const movieId = req.body.movies;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    const actor = await Actor.findById(actorId);
    if (!actor) {
      return res.status(404).json({ message: "Actor not found" });
    }
    const isActorExist = movie.actors.includes(actor._id);
    if (isActorExist) {
      return res
        .status(400)
        .json({ message: "Actor already added to the movie" });
    }

    // actor.name = req.body.name;
    actor.movies = [...actor.movies, movieId];
    movie.actors = [...movie.actors, actorId];

    await actor.save();
    await movie.save();

    return res.status(201).json(actor);
  } catch (error) {
    return next(error);
  }
};
