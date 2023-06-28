const { model, Schema } = require("mongoose");

const authSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = model("auth", authSchema);
