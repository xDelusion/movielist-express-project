const User = require("../db/models/User");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

exports.localStrategy = new LocalStrategy(
  { usernameField: "username" },
  async (username, password, done) => {
    try {
      const foundUser = await User.findOne({ username: username });
      if (!foundUser) {
        return done(null, false);
      }
      const passwordsMatch = await bcrypt.compare(password, foundUser.password);
      if (!passwordsMatch) {
        return done(null, false);
      }

      // req.user = foundUser
      done(null, foundUser);
    } catch (error) {
      return done(error);
    }
  }
);
