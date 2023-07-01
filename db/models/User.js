const { model, Schema } = require("mongoose");

const authSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: String,
    watchlist: [
      {
        movie: { type: Schema.Types.ObjectId, ref: "Movie" },
        watched: { type: Boolean, default: false },
      },
    ],
    isStaff: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("auth", authSchema);
