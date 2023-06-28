const { model, Schema } = require("mongoose");

const movieSchema = new Schema({
  title: { type: String },
  releaseDate: { type: Date },
  genre: { type: String },
  actors: {
    type: Schema.Types.ObjectId,
    ref: "Actor",
  },
});

module.exports = model("Movie", movieSchema);
