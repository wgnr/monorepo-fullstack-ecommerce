import passport from "passport"
import {
  Strategy as JWTStrategy,
  StrategyOptions,
  VerifyCallback,
  ExtractJwt
} from "passport-jwt"
import { GlobalVars } from "@config/globalVars"
import UsersService from "@services/users"

const { auth: { jwt: { JWT_TOKEN_SECRET } } } = GlobalVars

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_TOKEN_SECRET,
};

const verify: VerifyCallback = async (decodedTokenPayload, done) => {
  try {
    const { sub: userId } = decodedTokenPayload
    if (userId) {
      const user = (await UsersService.getById(userId)).toJSON();
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    done(error, false);
  }
}

passport.use(new JWTStrategy(options, verify));
