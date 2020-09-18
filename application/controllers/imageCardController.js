const db = require('../config/db');
const fs = require('fs');

// Show image page on GET
exports.imageCard_get = (req, res, next) => {
    let pid = req.params.pid;

    let sql = "SELECT * FROM posts WHERE pid = ?";
    let objToBePassed = {};

    db.query(sql, [pid], (err, result) => {
        if (err) {
            res.render('error');
        }
        objToBePassed = result;

        // Item found
        if (result.length !== 0) {
            res.render('imageCard', {
                data: objToBePassed
            });
        }
        // Item not found
        else {
            res.render('error');
        }
    });
}

// Show image page for revising image on GET
exports.edit_get = (req, res, next) => {
    let pid = req.params.pid;
    let user = req.user.id;

    let dataPassed = [];

    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) throw error;

        if (user != result[0].userid) {
            req.flash('error', 'Not the owner of the post.');
            res.redirect('/user/dashboard');
        }
        dataPassed = result[0];

        res.render('editImage', {
            values: dataPassed
        });
    });
}

//submits edits to the tilte and description
exports.edit_post = (req, res, next) => {
    let { title, description } = req.body;
    let pid = req.params.pid;
    let user = req.user.id;

    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) throw error;

        if (user != result[0].userid) {
            req.flash('error', 'Not the owner of the post.');
            res.redirect('/user/dashboard');
        }

        sql = "UPDATE posts SET title = ?, description = ? WHERE pid = ?";
        db.query(sql, [title, description, pid], (error2, result2) => {
            if (error2) throw error2;

            req.flash('success', 'Updated Post Information.');
            res.redirect('/user/dashboard');
        });
    });
}

exports.confirm_get = (req, res, next) => {
    let pid = req.params.pid;
    let user = req.user.id;
    let dataPassed = [];

    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) throw error;

        if (user != result[0].userid) {
            req.flash('error', 'Not the owner of the post.');
            res.redirect('/user/dashboard');
        }

        dataPassed = result[0];
        res.render('deleteConfirm', {
            values: dataPassed
        });

    });
}

exports.delete_get = (req, res, next) => {
    let pid = req.params.pid;
    let user = req.user.id;

    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) throw error;

        if (user != result[0].userid) {
            req.flash('error', 'Not the owner of the post.');
            res.redirect('/user/dashboard');
        }

        sql = "DELETE FROM posts WHERE pid = ?";
        let imageN = result[0].filename;

        db.query(sql, [pid], (error2, result2) => {
            if (error2) throw error2;

            fs.unlink('./public/images/uploads/' + user + '/postImages/' + imageN, (err) => {
                if (err) throw err;
                console.log('successfully deleted file.');
                
                req.flash('success', 'Deleted Post Information.');
                res.redirect('/user/dashboard');

            });
        });
    });
}