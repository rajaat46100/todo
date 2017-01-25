var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'todoSecret',
    resave: true,
    saveUninitialized: true
}));
app.set('views', './src/views');
app.set('view engine', 'ejs');
var passport = require('./passport/session')(app);
var signinRouter = require('./routers/signin')();
var signupRouter = require('./routers/signup')();
app.use('/SignIn', signinRouter);
app.use('/SignUp', signupRouter);
var todoRouter = require('./routers/todo')();

app.use('/to-do', todoRouter);

app.get('/', function(req, res) {
    if (req.user) {
        res.redirect('/to-do')
    } else {
        if (req.query.e) {
            res.render('home', { error: req.query.e });
        } else {
            res.render('home', { error: "" });
        }

    }

});



app.listen(3000, function() {
    console.log('listening...');
});