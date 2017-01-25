var express = require('express');
var searchRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

function router() {

    searchRouter.route('/')
        .post(function(req, res) {
            var output = [];
            mongodb.connect('mongodb://localhost:27017/test', function(err, db) {
                if (err) {
                    console.log(err);
                }
                var collection = db.collection('user');
                collection.find({}, { email: 1, name: 1 }).toArray(function(err, results) {
                    if (err) {
                        res.send(err);
                    }
                    if (results) {
                        results.forEach(function(user) {
                            if (user.email.includes(req.body.keyword)) {
                                output.push({
                                    email: user.email,
                                    name: user.name
                                });
                            }

                        });
                        res.send(output);
                    }
                });
            });
        });

    return searchRouter;
}

module.exports = router;