const passport = require('passport');
const db = require('../config/db');

// Display administrator's login page on GET
exports.login_get = (req, res, next) => {
    res.render('adminLogin');
}

// Handle administrator login authentication via Passport API on POST
exports.login_post = (req, res, next) => {
    passport.authenticate('administrator-login', {
        successRedirect: '/masteradmin/dashboard',
        failureRedirect: '/masteradmin/login',
        failureFlash: true,
        badRequestMessage: 'Please fill in all fields'
    })(req, res, next);
}

// Handle administrator logout on GET
exports.logout = (req, res, next) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
}

// Display administrator's dashboard page on GET
// Contains list of active and unapproved mods
exports.dashboard = (req, res, next) => {
    let activeMods = [];
    let unapprovedMods = [];

    // Retrieve the data from the mods table
    let sql = "SELECT id,username,status FROM mods";

    db.query(sql, (err, result) => {
        if (err) throw err;

        for (let i = 0; i < result.length; i++) {
            //status of 1 in a mod means that it is an active mod and 0 means a mod awaiting approval.
            if (result[i].status == 1) {
                activeMods.push(result[i])
            }
            else if (result[i].status == 0) {
                unapprovedMods.push(result[i]);
            }
        }

        res.render('adminDashboard', {
            activeMods: activeMods,
            unapprovedMods: unapprovedMods
        });
    });
}

// Handle approving of mods on GET
exports.approve = (req, res, next) => {
    let modId = req.params.mid;

    // Update status of a mod to 'Active'
    let sql = "UPDATE mods SET status = 1 WHERE id = ?";

    db.query(sql, [modId], (err, result) => {
        if (err) {
            req.flash('error', 'Error approving mod');
            res.redirect('/user/dashboard');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully approved mod');
            res.redirect('/admin/dashboard');
        }
        else {
            req.flash('error', 'Error approving mod');
            res.redirect('/user/dashboard');
        }
    });
}

// Handle disapproving of mods on GET
exports.disapprove = (req, res, next) => {
    let modId = req.params.mid;

    // Update status of a mod to 'Disapproved'
    let sql = "UPDATE mods SET status = 0 WHERE id = ?";

    db.query(sql, [modId], (err, result) => {
        if (err) {
            req.flash('error', 'Error disapproving mod');
            res.redirect('/user/dashboard');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully disapproved mod');
            res.redirect('/admin/dashboard');
        }
        else {
            req.flash('error', 'Error disapproving mod');
            res.redirect('/user/dashboard');
        }
    });
}

// Handle removing of mods on GET 
exports.remove = (req, res, next) => {
    let modId = req.params.mid;

    // Deletes a mod from the database
    let sql = "DELETE FROM mods WHERE id = ?";

    db.query(sql, [modId], (err, result) => {
        if (err) {
            req.flash('error', 'Error removing mod');
            res.redirect('/user/dashboard');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully removed mod');
            res.redirect('/admin/dashboard');
        }
        else {
            req.flash('error', 'Error removing mod');
            res.redirect('/user/dashboard');
        }
    });
}