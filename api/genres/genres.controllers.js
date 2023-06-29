const Genre = require("../../db/models/Genre");

exports.getGenre = async (req, res, next) => {
  try {
    const genres = await Genre.find();
    return res.status(201).json(genres);
  } catch (error) {
    return next(error);
  }
};

exports.addGenre = async (req, res, next) => {
  try {
    const newGenre = await Genre.create(req.body);
    return res.status(201).json(newGenre);
  } catch (error) {
    return next(error);
  }
};
