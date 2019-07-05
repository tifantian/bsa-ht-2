const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const users = require('./users');

const opts = {
    secretOrKey: 'secret',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JwtStrategy(opts, async (payload, done) => {
    try {
        const user = users.find(userFromDB => {
            if (userFromDB.login === payload.login) {
                return userFromDB;
            }            
        });
        return user ? done(null, user) : done({ status: 401, message: 'Token is invalid.' }, null);
    } catch (err) {
        return done(err);
    }
}));