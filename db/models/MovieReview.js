const { model, Schema } = require("mongoose");

const movieReviewSchema = new Schema(
  {
    rating: { type: number, required: true },
    review: { type: number, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
  },
  { timestamps: true }
);

module.exports = model("MovieReview", movieReviewSchema);
