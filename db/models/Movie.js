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
    actors: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      validate: {
        validator: (actors) => {
          return actors && actors.length > 0;
        },
        message: "The 'actors' field can't be empty.",
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Movie", movieSchema);
