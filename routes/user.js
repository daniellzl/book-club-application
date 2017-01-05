var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var model = require('../models/models');
var router = express.Router();

// export router
module.exports = router;

// get user page
router.get('/', ensureLoggedIn('/login'), function(req, res) {
    
    // storage for result
    var result = {};

    // find user information
    model.accountModel.findById(req.session.passport.user, function(err, user) {
        if (err) throw err;
        
        // save user information
        result.user = user;
    
        // find user information
        model.bookModel.find({ ownerId: req.session.passport.user }, function(err, books) {
            if (err) throw err;
            
            // Save search results to an object
            result.books = books;
            
            // display user page with search results
            return res.render('user', result);
        });
    });
});

// post create book
router.post('/create', ensureLoggedIn('/login'), function(req, res) {
    
    // get information from post request
    var title = req.body.title;
    var author = req.body.author;
    var imageURL = req.body.imageURL;
    var comments = req.body.comments;
    
    // create new ook and save to database
    var b = new model.bookModel({
        
        title: title,
        author: author,
        imageURL: imageURL,
        comments: comments,
        ownerId: req.session.passport.user,
        tradeWanted: [],
        tradeOffers: [],
        tradeOfferAccepted: false,
        traderInformation: {}
    });  
    b.save(function(err){
        if (err) throw err;
        
        // notify user of book creation
        return res.send('Book has been added.');
    });
});

// get accept trade offer
router.post('/acceptTrade', ensureLoggedIn('/login'), function(req, res) {
    
    // save information
    var bookWantedId = req.body.bookWantedId;
    var bookWantedOwnerId = req.body.bookWantedOwnerId;
    var bookOfferedId = req.body.bookOfferedId;
    var bookOfferedOwnerId = req.body.bookOfferedOwnerId;
    
    // find book offered
    model.bookModel.findById(bookOfferedId, function(err, bookOffered) {
        if (err) throw err;
        
        // mark that book has been traded
        bookOffered.tradeOfferAccepted = true;
        
        // append book wanted owner information to book offered
        model.accountModel.findById(bookWantedOwnerId, function(err, bookWantedOwner) {
            if (err) throw err;
            
            bookOffered.traderInformation = {
                email: bookWantedOwner.email,
                name: bookWantedOwner.name,
                city: bookWantedOwner.city,
                state: bookWantedOwner.state,
                zip: bookWantedOwner.zip
            };
            
            bookOffered.save(function(err) {
                if (err) throw err;
            });
        });
    });
    
    // find book wanted
    model.bookModel.findById(bookWantedId, function(err, bookWanted) {
        if (err) throw err;
        
        // mark that book has been traded
        bookWanted.tradeOfferAccepted = true;
        
        // notify all other trade offers of trade acceptance
        model.bookModel.find({ 'tradeWanted.bookWantedId' : bookWantedId}, function(err, otherBooksOffered) {
            if (err) throw err;
        
            for (var i = 0, l = otherBooksOffered.length; i < l; i++) {
                
                for (var j = 0, k = otherBooksOffered[i].tradeWanted.length; j < k; j++) {
                    
                    if (otherBooksOffered[i].tradeWanted[j].bookWantedId === bookWantedId) {
                        otherBooksOffered[i].tradeWanted[j].bookWantedAvailable = false;
                    }
                }
                
                otherBooksOffered[i].save(function(err) {
                    if (err) throw err;
                });
            }
        });
        
        // append book offered owner information to book wanted
        model.accountModel.findById(bookOfferedOwnerId, function(err, bookOfferedOwner) {
            if (err) throw err;
            
            bookWanted.traderInformation = {
                email: bookOfferedOwner.email,
                name: bookOfferedOwner.name,
                city: bookOfferedOwner.city,
                state: bookOfferedOwner.state,
                zip: bookOfferedOwner.zip
            };
            
            bookWanted.save(function(err) {
                if (err) throw err;
                
                // redirect to user page
                return res.send('Trade completed');
            });
        });
    });
});

// get accept trade offer
router.get('/acceptTrade/:tradeId', ensureLoggedIn('/login'), function(req, res) {
    
    // save information
    var array = req.params.tradeId.split('&');
    var bookWantedId = array[0];
    var bookWantedOwnerId = array[1];
    var bookOfferedId = array[2];
    var bookOfferedOwnerId = array[3];
    
    // find book offered
    model.bookModel.findById(bookOfferedId, function(err, bookOffered) {
        if (err) throw err;
        
        // mark that book has been traded
        bookOffered.tradeOfferAccepted = true;
        
        // append book wanted owner information to book offered
        model.accountModel.findById(bookWantedOwnerId, function(err, bookWantedOwner) {
            if (err) throw err;
            
            bookOffered.traderInformation = {
                email: bookWantedOwner.email,
                name: bookWantedOwner.name,
                city: bookWantedOwner.city,
                state: bookWantedOwner.state,
                zip: bookWantedOwner.zip
            };
            
            bookOffered.save(function(err) {
                if (err) throw err;
            });
        });
    });
    
    // find book wanted
    model.bookModel.findById(bookWantedId, function(err, bookWanted) {
        if (err) throw err;
        
        // mark that book has been traded
        bookWanted.tradeOfferAccepted = true;
        
        // notify all other trade offers of trade acceptance
        model.bookModel.find({ 'tradeWanted.bookWantedId' : bookWantedId}, function(err, otherBooksOffered) {
            if (err) throw err;
        
            for (var i = 0, l = otherBooksOffered.length; i < l; i++) {
                
                for (var j = 0, k = otherBooksOffered[i].tradeWanted.length; j < k; j++) {
                    
                    if (otherBooksOffered[i].tradeWanted[j].bookWantedId === bookWantedId) {
                        otherBooksOffered[i].tradeWanted[j].bookWantedAvailable = false;
                    }
                }
                
                otherBooksOffered[i].save(function(err) {
                    if (err) throw err;
                });
            }
        });
        
        // append book offered owner information to book wanted
        model.accountModel.findById(bookOfferedOwnerId, function(err, bookOfferedOwner) {
            if (err) throw err;
            
            bookWanted.traderInformation = {
                email: bookOfferedOwner.email,
                name: bookOfferedOwner.name,
                city: bookOfferedOwner.city,
                state: bookOfferedOwner.state,
                zip: bookOfferedOwner.zip
            };
            
            bookWanted.save(function(err) {
                if (err) throw err;
                
                // redirect to user page
                return res.redirect('/user');
            });
        });
    });
});

// post update profile information
router.post('/update', ensureLoggedIn('/login'), function(req, res) {
    
    // get info from post request
    var name = req.body.name;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    
    // find user
    model.accountModel.findById(req.session.passport.user, function(err, data) {
        if (err) throw err;
        
        // update user information
        data.name = name;
        data.city = city;
        data.state = state;
        data.zip = zip;
        
        // save updates
        data.save(function(err) {
            if (err) throw err;
            
            // notify user of update
            return res.send('Account information has been updated.');;
        });
    });
});

// post books to display in dropdown menu
router.post('/books', function(req, res) {
    
    // if user is not logged in
    if (req.session.passport === undefined) {
        
        // tell user to log in
        return res.send('Please log into your account.');
    }
    
    // find books owned by user
    model.bookModel.find({ ownerId: req.session.passport.user }, function(err, data) {
        if (err) throw err;
        
        // if user has no books
        if (data.length === 0) {
            
            // tell user that no books are available
            return res.send('No books available for trading.');
        }
        
        // save user books
        var result = {};
        result.books = data;

        // send user books
        return res.json(data);
    });
});

// post remove book
router.post('/removeBook/:bookId', ensureLoggedIn('/login'), function(req, res) {
    
    // save book id
    var bookId = req.params.bookId;
    
    // find book by id and remove
    model.bookModel.findByIdAndRemove(bookId, function(err) {
        if (err) throw err;
        
        // notify all trade offers of unavailability
        model.bookModel.find({ 'tradeWanted.bookWantedId' : bookId}, function(err, otherBooksOffered) {
            if (err) throw err;
            
            for (var i = 0, l = otherBooksOffered.length; i < l; i++) {
                
                for (var j = 0, k = otherBooksOffered[i].tradeWanted.length; j < k; j++) {
                    
                    if (otherBooksOffered[i].tradeWanted[j].bookWantedId === bookId) {
                        
                        otherBooksOffered[i].tradeWanted[j].bookWantedAvailable = false;
                    }
                }
                
                otherBooksOffered[i].save(function(err) {
                    if (err) throw err;
                });
            }
        });

        // notify user of book deletion
        return res.redirect('/user');
    });
});

// get log out
router.get('/logout', ensureLoggedIn('/login'), function(req, res){
    
    // log user out
    req.logout();
    
    // redirect user to home page
    return res.redirect('/');
});