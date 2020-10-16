//Contributors: Osbaldo Martinez

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db2');

module.exports = () => {
    //retrieve the aidmin from the admin table
    passport.use('administrator-login', new LocalStrategy(
        (username, password, done) => {
            db.query("SELECT * FROM admin WHERE username = ? LIMIT 1", username, (error, result) => {
                if (error) return done(error);
                if (result.length == 0) {
                    return done(null, false, { message: 'Username and/or password is incorrect' });
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

    //give the user its aid
    passport.serializeUser((user, done) => {
        return done(null, user.aid);
    });

    //logout the admin
    passport.deserializeUser((id, done) => {
        db.query("SELECT * FROM admin WHERE aid = ?", id, (err, result) => {
            if (err) throw err;

            return done(null, result[0]);
        });
    });
};