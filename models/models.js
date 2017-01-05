var mongoose = require('mongoose');

// book schema
var bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    imageURL: String,
    comment: String,
    ownerId: String,
    tradeWanted: [{
        bookWantedAvailable: Boolean,
        bookWantedId: String,
        bookWantedOwnerId: String,
        bookWantedTitle: String,
        bookOfferedId: String,
        bookOfferedOwnerId: String,
        bookOfferedTitle: String
    }],
    tradeOffers: [{
        bookWantedId: String,
        bookWantedOwnerId: String,
        bookWantedTitle: String,
        bookOfferedId: String,
        bookOfferedOwnerId: String,
        bookOfferedTitle: String
    }],
    tradeOfferAccepted: Boolean,
    traderInformation: {
        email: String,
        name: String,
        city: String,
        state: String,
        zip: String
    },
    createdAt: { type: Date, default: Date.now }
});
var bookModel = mongoose.model('book', bookSchema);

// account schema
var accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    email: String,
    name: String,
    city: String,
    state: String,
    zip: String,
});
var accountModel = mongoose.model('account', accountSchema);

// export book and account models
module.exports = {
    bookModel: bookModel,
    accountModel: accountModel
};