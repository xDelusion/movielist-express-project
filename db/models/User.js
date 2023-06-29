const { model, Schema } = require("mongoose");

const authSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: String,
  },
  { timestamps: true }
);

module.exports = model("auth", authSchema);
