const { model, Schema } = require("mongoose");

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    genre: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    actors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Actor",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Movie", movieSchema);
