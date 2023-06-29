const { model, Schema } = require("mongoose");

const genreSchema = new Schema(
  {
    name: { type: String, required: true },
    movies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Genre", genreSchema);
