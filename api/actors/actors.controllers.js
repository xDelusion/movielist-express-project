const Actor = require("../../db/models/Actor");

exports.getActor = async (req, res, next) => {
  try {
    const actors = await Actor.find();
    return res.status(200).json(actors);
  } catch (error) {
    return next(error);
  }
};

exports.addActor = async (req, res, next) => {
  try {
    const newActor = await Actor.create(req.body);
    return res.status(201).json(newActor);
  } catch (error) {
    return next(error);
  }
};
