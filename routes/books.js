var express = require('express');
var model = require('../models/models');
var router = express.Router();

// export router
module.exports = router;

// get book
router.get('/:id', function(req, res) {
    
    // save book ID
    var id = req.params.id;

    // find book by Id
    model.bookModel.findById(id, function(err, data) {
        if (err) throw err;
        
        // save search results to an object
        var result = {};
        result.book = data;

        // display book page with search results
        return res.render('books', result); 
    });
});

// post trade
router.post('/trade', function(req, res) {
    
    // save post information to variables
    var bookWantedId = req.body.bookRequested;
    var bookOfferedId = req.body.bookOfferedId;
    var bookOfferedTitle = req.body.bookOfferedTitle;
    var bookWantedOwnerId = req.body.bookWantedOwnerId;
    var bookWantedTitle = req.body.bookWantedTitle;
    
    // look for book requested
    model.bookModel.findById(bookWantedId, function(err, bookWanted) {
        if (err) throw err;
        
        // ensure you can't trade for your own book
        if (req.session.passport.user === bookWanted.ownerId) {
            return res.send("Error: Can't offer to trade for your own book.");
        }
        
        // append trade request to book
        bookWanted.tradeOffers.push({
            bookWantedId: bookWantedId,
            bookWantedOwnerId: bookWantedOwnerId,
            bookWantedTitle: bookWantedTitle,
            bookOfferedId: bookOfferedId,
            bookOfferedOwnerId: req.session.passport.user,
            bookOfferedTitle: bookOfferedTitle
        });
        
        // save trade request
        bookWanted.save(function(err) {
            if (err) throw err;
            
            // find book offered
            model.bookModel.findById(bookOfferedId, function(err, bookOffered) {
                if (err) throw err;
                
                // append trade request to book
                bookOffered.tradeWanted.push({
                    bookWantedAvailable: true,
                    bookWantedId: bookWantedId,
                    bookWantedOwnerId: bookWantedOwnerId,
                    bookWantedTitle: bookWantedTitle,
                    bookOfferedId: bookOfferedId,
                    bookOfferedOwnerId: req.session.passport.user,
                    bookOfferedTitle: bookOfferedTitle
                });
                
                // save trade request
                bookOffered.save(function(err) {
                    if(err) throw err;
                    
                    // return notify user
                    return res.send('Your trade request has been submitted.');
                });
            });
        });
    });
})