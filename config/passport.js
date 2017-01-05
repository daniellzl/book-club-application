var passport = require('passport');
var strategy = require('passport-local').Strategy;
var model = require('../models/models');

// export function
module.exports = function(passport) {
    
    // local strategy
    passport.use(new strategy(
    
        function(username, password, done) {
          
            model.accountModel.findOne({ username: username }, function (err, user) {
                if (err) return done(err);
                if (!user) {
                    return done(null, false);
                }
                if (password != user.password) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));
    
    // save user id
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
};