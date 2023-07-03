const { model, Schema } = require("mongoose");

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    avgRating: {
      type: Number,
      default: null,
    },
    genres: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    actors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Actor",
        required: true,
      },
    ], // validate: {
    //   validator: (actors) => {
    //     return actors && actors.length > 0;
    //   },
    //   message: "The 'actors' field can't be empty.",
    // },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "MovieReview",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Movie", movieSchema);
