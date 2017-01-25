var express = require('express');
var signupRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

function route() {
    signupRouter.route('/')
        .post(function(req, res, next) {
                if (!req.body.email.match("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}") || req.body.password.length < 6) {
                    res.redirect('/?e=' + encodeURIComponent('Invalid email or password'));
                } else if (req.body.password !== req.body.retypePwd) {
                    res.redirect('/?e=' + encodeURIComponent('Password do not match'));
                } else {
                    next();
                }
            }, function(req, res, next) {
                mongodb.connect('mongodb://localhost:27017/test', function(err, db) {
                    if (err) {
                        console.log(err);
                    }
                    var collection = db.collection('user');
                    collection.findOne({ email: req.body.email }, function(err, results) {
                        if (results) {
                            res.redirect('/?e=' + encodeURIComponent('user already exist'));
                        } else {
                            next();
                        }

                    });
                });
            },
            function(req, res) {
                var user = {
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.userName,
                    todos: {
                        pending: {
                            private: [],
                            shared: [],
                            sent: []
                        },
                        completed: {
                            private: [],
                            shared: [],
                            sent: []
                        }
                    }
                }
                mongodb.connect('mongodb://localhost:27017/test', function(err, db) {
                    if (err) {
                        console.log(err);
                    }
                    var collection = db.collection('user');
                    collection.insertOne(user, function(err, results) {
                        if (err) {
                            res.redirect('/?e=' + encodeURIComponent('sign up failed'));
                        }
                        if (results) {
                            console.log(results);
                            req.login(req.body.email, function() {
                                res.redirect('/to-do');
                            });
                        }

                    });
                });
            });

    return signupRouter;
}

module.exports = route;