var express = require('express');
var searchShared = express.Router();
var mongodb = require('mongodb').MongoClient;

function check(newArr, old) {
    var output = [];
    if (old.length === 0) {
        return newArr;
    } else {
        for (var x in newArr) {
            if (newArr[x] !== old[x]) {
                output.push(newArr[x]);
            }
        }
        return output;
    }
}


function router() {
    searchShared.route('/')
        .post(function(req, res) {
            console.log('in search Shared');
            var old = req.body.oldShared;
            console.log(old);

            mongodb.connect('mongodb://localhost:27017/test', function(err, db) {
                if (err) {
                    console.log(err);
                }
                var collection = db.collection('user');
                collection.findOne({ email: req.user }, function(err, results) {
                    if (err) {
                        res.send(err);
                    }
                    if (results) {
                        res.send(check(results.todos.pending.shared, old));
                    }

                });

            });
        });


    return searchShared;
}

module.exports = router;