const passport = require('passport');

class Auth {
    static authenticate(req, res, next) {
        passport.authenticate('jwt',
            (err, user, authenticateError) =>
                Auth.processAuthenticate(req, res, next, err, user, authenticateError))(req, res, next);
    }

    static processAuthenticate(req, res, next, err, user, authenticateError) {
        if (authenticateError) {
            return next(new Error(authenticateError.message));
        }
        if (err) {
            return next(err);
        }
        // Check User
        if (!user) {
            return next(new Error('User unauthorized'));
        }

        req.user = user;

        return next();
    }

}

module.exports = Auth;