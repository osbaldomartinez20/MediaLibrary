//Contributors: Osbaldo Martinez

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db2');
const fs = require('fs');

module.exports = () => {
    //retrives the given mod by the username
    passport.use('user-login', new LocalStrategy(
        (username, password, done) => {
            db.query("SELECT * FROM mods WHERE username = ? and status = 1 LIMIT 1", username, (error, result) => {
                if (error) return done(error);
                if (result.length == 0) {
                    return done(null, false, { message: 'Username and/or password is incorrect or unapproved user' });
                }
                // Match password
                bcrypt.compare(password, result[0].password, (error, isMatch) => {
                    if (error) {
                        fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
                    }
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

    //give the mod its id
    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    //logout the mod
    passport.deserializeUser((id, done) => {
        db.query("SELECT * FROM mods WHERE id = ?", id, (err, result) => {
            if (err) {
                fs.writeFileSync(__dirname + '/' + Date.now() + 'error.log', err + '');
            }

            return done(null, result[0]);
        });
    });
};