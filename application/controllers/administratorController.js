const passport = require('passport');
const db = require('../config/db2');
const cache = require('../helper/dataCache');
const post = require('./getPostController');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const separate = require('../helper/separeteByCommas');

let numCache = new cache.cache(post.getNumberApproved, "2", 1);

// Display administrator's login page on GET
exports.login_get = (req, res, next) => {
    numCache.getData()
        .then((count) => {
            res.render('adminLogin', { count: count });
        }).catch((error) => {
            res.render('error');
        });
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

exports.changePassword = (req, res, next) => {
    let uid = req.user.aid;
    let { password, confirmPassword } = req.body;

    if (password.length < 8 || password.length > 20) {
        req.flash('error', 'Password must be between 8 and 20 characters.');
    }
    // Check if passwords match
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords must match.');
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;

        bcrypt.hash(password, salt, (err2, hash) => {
            if (err2) throw err2;

            password = hash;

            let sql = "UPDATE admin SET password = ? WHERE aid = ?"

            db.query(sql,[hash, uid], (error, result) => {
                if(error) throw error;

                req.flash('success', 'Successfully changed password');
                res.redirect('/masteradmin/dashboard');
            });
        });
    });

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

        numCache.getData()
            .then((count) => {
                res.render('adminDashboard', {
                    activeMods: activeMods,
                    unapprovedMods: unapprovedMods,
                    count: count
                });
            }).catch((error) => {
                res.render('error');
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
            res.redirect('/masteradmin/dashboard');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully approved mod');
            res.redirect('/masteradmin/dashboard');
        }
        else {
            req.flash('error', 'Error approving mod');
            res.redirect('/masteradmin/dashboard');
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
            res.redirect('/masteradmin/dashboard');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully disapproved mod');
            res.redirect('/masteradmin/dashboard');
        }
        else {
            req.flash('error', 'Error disapproving mod');
            res.redirect('/masteradmin/dashboard');
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
            res.redirect('/masteradmin/dashboard');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully removed mod');
            res.redirect('/masteradmin/dashboard');
        }
        else {
            req.flash('error', 'Error removing mod');
            res.redirect('/masteradmin/dashboard');
        }
    });
}

//Handles approval of item with the given pid
exports.itemApproval = (req, res, next) => {
    let pid = req.params.pid;

    let sql = "UPDATE posts SET status = 1 WHERE pid = ?";

    db.query(sql, [pid], (err, result) => {
        if (err) {
            req.flash('error', 'Error approving item');
            res.redirect('/masteradmin/imagereview');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully approved item');
            res.redirect('/masteradmin/imagereview');
        }
        else {
            req.flash('error', 'Error approving item');
            res.redirect('/masteradmin/imagereview');
        }
    });
}


exports.itemDeletion = (req, res, next) => {
    let pid = req.params.pid;

    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) throw error;

        sql = "DELETE FROM tags WHERE pid = ?;";
        sql += "DELETE FROM links WHERE pid = ?;";
        sql += "DELETE FROM posts WHERE pid = ?;"

        let coverImage = result[0].cover;
        let sampleImage = result[0].image;

        db.query(sql, [pid, pid, pid], (error2, result2) => {
            if (error2) throw error2;

            fs.unlink('./public/images/upload/' + coverImage, (err) => {
                if (err) throw err;
                console.log('successfully deleted file.');

                fs.unlink('./public/images/upload/' + sampleImage, (err2) => {
                    if (err) throw err2;

                    req.flash('success', 'Deleted Post Information.');
                    res.redirect('/masteradmin/imagereview');
                });
            });
        });
    });
}


exports.editPost_post = (req, res, next) => {
    let { pid, title, jtitle, author, description, details, type, tags, links } = req.body;
    let japTitle = "";
    let placeholders = [];

    if (jtitle) {
        japTitle = jtitle;
    }

    let sqlDel = "DELETE FROM links WHERE pid = ?; DELETE FROM tags WHERE pid = ?";

    let delPlaceholders = [pid, pid];

    db.query(sqlDel, delPlaceholders, (error, result) => {
        if (error) throw error;

        let linksList = separate.separateLinks(links);
        let tagsList = separate.separateTags(tags);

        let sql = "UPDATE posts SET title = ?, jtitle = ?, author = ?, description = ?, details = ?, type = ? WHERE pid = ?;";
        let postPlaceholders = [title, japTitle, author, description, details, type, pid];
        placeholders.push(...postPlaceholders);

        let tempId; //a tempId value to hold the newly generated id of links and tags.

        //generate the SQL for the links insertion.
        for (let i = 0; i < linksList.length; i++) {
            tempId = uuidv4();
            sql += "INSERT INTO links (lid, links, pid) VALUES (?,?,?);";
            placeholders.push(tempId);
            placeholders.push(linksList[i]);
            placeholders.push(pid);
        }

        //generate the SQL for the tags insertion.
        for (let j = 0; j < tagsList.length; j++) {
            tempId = uuidv4();
            sql += "INSERT INTO tags (tgid, tags, pid) VALUES (?,?,?);";
            placeholders.push(tempId);
            placeholders.push(tagsList[j]);
            placeholders.push(pid);
        }

        db.query(sql, placeholders, (err, result) => {
            if (err) {
                req.flash('error', 'Error updating post info.');
                res.redirect('/masteradmin/imagereview');
            }

            if ((typeof result !== 'undefined')) {
                req.flash('success', 'Successfully updated post info.');
                res.redirect('/masteradmin/imagereview');
            }
            else {
                req.flash('error', 'Error updating post info.');
                res.redirect('/masteradmin/imagereview');
            }
        });
    });
}

exports.addImage_post = (req, res, next) => {
    let { pid, cover, image } = req.body;
    let newImages = req.files;
    let workImage;
    let coverImage = newImages.coverImage[0].filename;
    let skipWork = true;
    let skipCover = false;
    let placeholders = [];

    let sql = "UPDATE posts SET cover = ?";
    placeholders.push(coverImage);

    if (newImages.mangaImage != undefined) {
        workImage = newImages.mangaImage[0].filename;
        skipWork = false;
        sql += ", image = ?";
        placeholders.push(workImage);
    }

    if (cover == "noCover.png") {
        skipCover = true;
    }

    sql += " WHERE pid = ?";
    placeholders.push(pid);

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            req.flash('error', 'Error updating image.');
            res.redirect('/masteradmin/imagereview');
        }

        if ((typeof result !== 'undefined')) {
            if (skipCover) {
                if (skipWork) {
                    req.flash('success', 'Successfully updated image.');
                    res.redirect('/masteradmin/imagereview');
                } else {
                    fs.unlink('./public/images/upload/' + image, (err) => {
                        if (err) throw err;
                        req.flash('success', 'Successfully updated image.');
                        res.redirect('/masteradmin/imagereview');
                    });
                }
            } else {
                fs.unlink('./public/images/upload/' + cover, (err) => {
                    if (err) throw err;
                    if (skipWork) {
                        req.flash('success', 'Successfully updated image.');
                        res.redirect('/masteradmin/imagereview');
                    } else {
                        fs.unlink('./public/images/upload/' + image, (err2) => {
                            if (err2) throw err2;
                            req.flash('success', 'Successfully updated image.');
                            res.redirect('/masteradmin/imagereview');
                        });
                    }
                });
            }
        } else {
            req.flash('error', 'Error updating image.');
            res.redirect('/masteradmin/imagereview');
        }
    });
}