var passport = require('passport');

function passportMiddleware(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(email, done) {
        done(null, email);
    });

    passport.deserializeUser(function(email, done) {
        done(null, email);
    });

    require('./localStrategy')(passport);

}


module.exports = passportMiddleware;