module.exports = (error, req, res, next) => {
  return res
    .status(error.status || 500)
    .json({ message: error.message || "Internal server error" });
};
