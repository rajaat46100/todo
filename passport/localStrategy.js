var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb').MongoClient;

function strategy(passport) {
    console.log('local');
    passport.use(new LocalStrategy({
            usernameField: 'email'
        },
        function(email, password, done) {
            console.log('authentication');
            console.log(email, password)
            mongodb.connect('mongodb://localhost:27017/test', function(err, db) {

                var collection = db.collection('user');
                collection.findOne({
                    $and: [
                        { email: email },
                        { password: password }
                    ]
                }, function(err, user) {
                    console.log(user);
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false);
                    }
                    if (user) {
                        return done(null, user.email);
                    }

                });
            });
        }));
}

module.exports = strategy;