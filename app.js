/********************
BOOK CLUB APPLICATION
********************/

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var strategy = require('passport-local').Strategy;
var model = require('./models/models');

// application
var app = express();

// public directory
app.use(express.static(__dirname + '/public'));

// http request logger
app.use(logger("dev", { format: 'dev', immediate: true }));

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// templating engine
var hbs = handlebars.create({
    defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// mongo database
var connectionString = process.env.MONGO_DB;
mongoose.connect(connectionString);
var db = mongoose.connection;
db.on('error', function(){
    console.log('There was an error connecting to the database');
});
db.once('open', function() {
    console.log('Successfully connected to database');
});

// authentication
require('./config/passport')(passport);
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

//routes
var home = require('./routes/home');
var books = require('./routes/books');
var user = require('./routes/user');
app.use('/', home);
app.use('/books', books);
app.use('/user', user);

// listen to port for connections
var port = process.env.PORT || 8080;
app.listen(port,  function () {
    console.log('Node.js listening on port ' + port + '...');
});