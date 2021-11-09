const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const passport = require("passport");
const { User } = require("../models");

const createStrategy = (...roles) => {
  return new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (payload, done) => {
      try {
        const user = await User.findOne({ where: { id: payload.id } });
        if (roles.includes(user.role)) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        done(err, null);
      }
    }
  );
};

passport.use("jwtCustomer", createStrategy("CUSTOMER"));
passport.use("jwtAdmin", createStrategy("ADMIN"));
passport.use("jwtAll", createStrategy("CUSTOMER", "ADMIN"));
