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
    if (!req.user.isStaff) {
      return res
        .status(403)
        .json({ message: "Only staff members can add actors" });
    }
    const newActor = await Actor.create(req.body);
    return res.status(201).json(newActor);
  } catch (error) {
    return next(error);
  }
};
