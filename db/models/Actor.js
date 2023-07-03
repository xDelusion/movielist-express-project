const { model, Schema } = require("mongoose");

const actorSchema = new Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: Date },
    movies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Actor", actorSchema);
