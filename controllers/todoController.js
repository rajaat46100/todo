var mongodb = require('mongodb').MongoClient;
module.exports = {
    root: function(req, res) {
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
                    todos = results.todos;
                    io.of('/to-do').on('connection', function(socket) {
                        users[req.user] = socket;
                    });


                    res.render('to-do', { todos: todos, email: req.user });
                }

            });
        });
    }
}