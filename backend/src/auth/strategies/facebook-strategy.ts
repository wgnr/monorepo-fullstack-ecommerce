import { GlobalVars } from "../../config"
import passport from "passport";
import {
  Strategy as FacebookStrategy,
  Profile,
} from "passport-facebook";
import UsersServices from "@services/users"
import { IUserNewFacebook, UserType } from "@models/entities/users/users.interface";


const { SERVER_URL, auth: { socials: { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } } } = GlobalVars

passport.use(
  new FacebookStrategy({
    clientID: FACEBOOK_APP_ID || "",
    clientSecret: FACEBOOK_APP_SECRET || "",
    callbackURL: `${SERVER_URL}/api/auth/facebook/callback`,
    profileFields: ["id", "displayName", "first_name", "email", "photos"],
  },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        const user = await UsersServices.getByFacebookId(profile.id)
        return done(null, user);
      } catch (err) {
        const newUser: IUserNewFacebook = {
          firstName: profile.name?.givenName || profile.displayName,
          lastName: "",
          social: { facebook: profile._json },
          email: profile.emails && profile.emails[0].value,
          type: UserType.USER,
        };

        try {
          const user = await UsersServices.createSocial(newUser)
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    }
  ))
