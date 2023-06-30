const { model, Schema } = require("mongoose");

const movieReviewSchema = new Schema(
  {
    rating: { type: Number, required: true },
    review: { type: String, required: true },
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
