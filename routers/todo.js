var express = require('express');
var todoRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

function route(io) {
    var todos;
    var users = {};
    todoRouter.use(function(req, res, next) {
        if (!req.user) {
            res.redirect('/');
        } else {
            next();
        }
    });


    todoRouter.route('/')
        .get(function(req, res) {
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
        });

    todoRouter.route('/logout')
        .get(function(req, res) {
            delete users[req.user];
            req.logout();
            res.redirect('/');
        });

    todoRouter.route('/addMemo')
        .post(function(req, res) {
            var memo = req.body.memo;

            mongodb.connect('mongodb://localhost:27017/test', function(err, db) {
                if (err) {
                    console.log(err);
                }
                var collection = db.collection('user');
                collection.updateOne({ email: req.user }, { $push: { 'todos.pending.private': memo } }, function(err, results) {
                    if (err) {
                        res.status(503).send(err);
                    }
                    if (results) {
                        res.send('Successful');

                    }

                });
            });

        });
    todoRouter.route('/modify')
        .post(function(req, res) {
            var mapper = {
                '#completed-shared-body': 'todos.completed.shared',
                '#pending-shared-body': 'todos.pending.shared',
                '#completed-priv-body': 'todos.completed.private',
                '#pending-priv-body': 'todos.pending.private'
            }
            var memo = req.body.memo;
            var fromContext = mapper[req.body.fromContext];
            var toContext = mapper[req.body.toContext];

            mongodb.connect('mongodb://localhost:27017/test', function(err, db) {
                if (err) {
                    console.log(err);
                }
                var collection = db.collection('user');
                collection.updateOne({ email: req.user }, {
                    $pull: {
                        [fromContext]: memo
                    },
                    $push: {
                        [toContext]: memo
                    }
                }, function(err, results) {
                    if (err) {
                        res.status(503).send(err);
                    }
                    if (results) {
                        res.send('Successful');

                    }

                });
            });
        });

    todoRouter.route('/share')
        .post(function(req, res) {
            var memo = req.body.memo;
            var toUser = req.body.toUser;


            mongodb.connect('mongodb://localhost:27017/test', function(err, db) {
                if (err) {
                    console.log(err);
                }
                var collection = db.collection('user');
                collection.updateOne({ email: toUser }, {
                    $push: {
                        'todos.pending.shared': memo
                    }
                }, function(err, results) {
                    if (err) {
                        res.status(503).send(err);
                    }
                    if (results) {
                        if (users[toUser]) {
                            users[toUser].emit('change', { shared: memo });
                        }
                        res.send('Successful');
                    }
                });
            });

        });


    var searchRouter = require('./searchUsers')();
    todoRouter.use('/searchUsers', searchRouter);

    return todoRouter;
}

module.exports = route;