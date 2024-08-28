import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import appConfig from '../../../../configs/app.config.js';
import { User } from '../../models/index.model.js';

passport.use(new GoogleStrategy({
    clientID: appConfig.google.clientId,
    clientSecret: appConfig.google.clientSecret,
    callbackURL: appConfig.google.callbackURL || '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({googleId: profile.id});
        if (user) {
            done(null, user)
        }
        user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName
        })
        done(null, user)
    } catch (error) {
        return done(error)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
})