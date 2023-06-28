const { model, Schema } = require("mongoose");

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    genre: { type: String, required: true },
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
