import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunctionWithRequest } from "passport-local";
import bCrypt from "bcryptjs";
import UsersServices from "@services/users";

const comparePasswords = (password: string, hashedPassword: string) =>
  bCrypt.compare(password, hashedPassword);

const loginVerify: VerifyFunctionWithRequest = async (req, email, password, done) => {
  try {
    const user = await UsersServices.getByEmail(email, true);
    if (!(await comparePasswords(password, user.password!)))
      return done(null, false, { message: `user or password is incorrect` });

    return done(null, user);
  } catch (err) {
    return done(err, false, { message: `user or password is incorrect` });
  }
};

passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
    },
    loginVerify
  )
);
