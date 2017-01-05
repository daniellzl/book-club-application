var express = require('express');
var passport = require('passport');
var model = require('../models/models');
var router = express.Router();

// export router
module.exports = router;

// get home page
router.get('/', function(req, res) {
    
    // find all surveys in database that haven't been traded
    model.bookModel.find({ tradeOfferAccepted: false}, function(err, data) {
        if (err) throw err;
        
        // Save search results to an object
        var result = {};
        result.books = data;

        // display homepage with search results
        return res.render('home', result); 
    });
});

// get registration
router.get('/register', function(req, res) {
    
    // display registration page with search results
    return res.render('register');
});

// post registration
router.post('/register', function(req, res, next) {
    
    // save post information
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var name = req.body.name;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    
    // error check
    if (username === '' || password === '' || email === '' || name === '' || city === '' || state === '' || zip === '') {
        return res.render('register-fail');
    }
    
    // create new account and save to database
    var a = new model.accountModel({
        username: username,
        password: password,
        email: email,
        name: name,
        city: city,
        state: state,
        zip: zip,
    });  
    a.save(function(err){
        if (err) throw err;
        return next();
    });
    
// authenticate user
}, passport.authenticate('local'), function(req, res) {
    
    // redirect to user page
    return res.redirect('/user');
});

// get login
router.get('/login', function(req, res) {
    
    // display login page
    return res.render('login');
});

// get login-fail
router.get('/login-fail', function(req, res) {
    
    // display login-fail page
    return res.render('login-fail');
});

// post login
// authenticate user
router.post('/login', passport.authenticate('local', { failureRedirect: '/login-fail'}), function(req, res) {
    
    // if login successful redirect to user page
    return res.redirect('/user');
});