const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db2');

module.exports = () => {
    passport.use('user-login', new LocalStrategy(
        (username, password, done) => {
            db.query("SELECT * FROM mods WHERE username = ? and status = 1 LIMIT 1", username, (error, result) => {
                if (error) return done(error);
                if (result.length == 0) {
                    return done(null, false, { message: 'Username and/or password is incorrect or unapproved user' });
                }
                // Match password
                bcrypt.compare(password, result[0].password, (error, isMatch) => {
                    if (error) throw error;
                    if (isMatch) {
                        return done(null, result[0]);
                    }
                    else {
                        return done(null, false, { message: 'Username and/or password is incorrect' });
                    }
                });
            });
        }
    ));

    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        db.query("SELECT * FROM mods WHERE id = ?", id, (err, result) => {
            if (err) throw err;

            return done(null, result[0]);
        });
    });
};