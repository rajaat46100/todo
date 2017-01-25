var express = require('express');
var signinRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

function route() {
    signinRouter.route('/')
        .post(function(req, res, next) {
            if (!req.body.email.match("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}") || req.body.password.length < 6) {
                res.redirect('/?e=' + encodeURIComponent('Invalid Email or password convention'));
            } else {
                next();
            }
        }, passport.authenticate('local', {
            failureRedirect: '/?e=' + encodeURIComponent('Wrong email or password'),
            successRedirect: '/to-do'
        }));

    return signinRouter;
}

module.exports = route;