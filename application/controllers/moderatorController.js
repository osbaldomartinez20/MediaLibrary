const db = require('../config/db2');//non-promise database connection
const fs = require('fs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const commas = require('../helper/addCommas');
const separate = require('../helper/separeteByCommas');
const cache = require('../helper/dataCache');
const post = require('./getPostController');
const types = require('./typeController');
const { count } = require('console');
const e = require('express');

let numCache = new cache.cache(post.getNumberApproved, "2", 1);
let typesCache = new cache.cache(types.retrieve, "1", 1440);

// Handle showing student login page on GET
exports.login_get = (req, res, next) => {
    let redirectUrl = req.query.redirectUrl;

    if (!redirectUrl) {
        redirectUrl = req.get('Referrer');
    }
    numCache.getData()
        .then((count) => {
            res.render('userLogin', {
                redirectUrl: redirectUrl,
                count: count
            });
        }).catch((error) => {
            res.render('error');
        });
}

// Handle student login authentication via Passport API on POST
exports.login_post = (req, res, next) => {
    let redirectUrl = req.query.redirectUrl;


    // Lazy login; set redirect url so that moderator is redirected back to appropriate page
    if (redirectUrl == '' || redirectUrl == undefined) {
        redirectUrl = '/moderators/dashboard';
    }

    // Proceed with login authentication
    passport.authenticate('user-login', {
        successRedirect: redirectUrl,
        failureRedirect: '/moderators/login',
        failureFlash: true,
        badRequestMessage: 'Please fill in all fields'
    })(req, res, next);

}

// Handle showing registration page for user on GET
exports.register_get = (req, res, next) => {
    numCache.getData()
        .then((count) => {
            res.render('register', { count: count });
        }).catch((error) => {
            res.render('error');
        });
}

// Handle registration for student on POST
exports.register_post = (req, res, next) => {
    let { username, password, confirmPassword } = req.body;
    let uid = uuidv4();
    ///*
    let regError = [];
    let dataPassedBack = {};

    // Check if required fields are filled
    if (!username || !password || !confirmPassword) {
        regError.push({ message: 'Please fill in all fields' });
    }
    // Validate input fields
    else {
        // Check if password is between 8-20 characters
        if (password.length < 8 || password.length > 20) {
            dataPassedBack.username = username;
            regError.push({ message: 'Password must be between 8-20 characters' });
        }
        // Check if passwords match
        if (password !== confirmPassword) {
            dataPassedBack.username = username;
            regError.push({ message: 'Passwords do not match' });
        }
    }
    numCache.getData()
        .then((count) => {
            // Render registration error messages if necessary
            if (regError.length > 0) {
                res.render('register', {
                    regError,
                    dataPassedBack,
                    count: count
                });
            }
            // Input validation passed
            else {
                // Check if username already exists
                db.query("SELECT * FROM mods WHERE username = ?", [username], (err, result) => {
                    if (err) throw err;

                    if (result.length > 0) {
                        regError.push({ message: 'Such user already exists. Please log in.' });
                        res.render('userLogin', {
                            regError,
                            count: count
                        });
                    }
                    else {
                        // Create a hashed password
                        bcrypt.genSalt(10, (err, salt) => {
                            if (err) throw err;

                            bcrypt.hash(password, salt, (err, hash) => {
                                if (err) throw err;

                                password = hash;
                                console.log(hash);

                                // Insert new user into database
                                db.query("INSERT INTO mods (id, username, password, status) VALUES (?, ?, ?, ?)", [uid, username, password, 0], (error, result) => {
                                    if (err) throw err;

                                    req.flash('success', 'Successfully Submitted Your Mod Account For Review.');
                                    res.redirect('/moderators/login');
                                });
                            });
                        });
                    }
                });
            }
        }).catch((error) => {
            res.render('error');
        });

}

// Handle mod logout on GET
exports.logout = (req, res, next) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
}

// Display user's dashboard page on GET
// Retrieve list of posts listed by the user that is logged in
exports.dashboard = (req, res, next) => {

    let sql = "SELECT pid, title, cover, image FROM posts WHERE status = 0";

    db.query(sql, (error, result) => {
        if (error) throw error;
        numCache.getData()
            .then((count) => {
                res.render('userDashboard', {
                    post: result,
                    count: count
                });
            }).catch((error) => {
                res.render('error');
            });

    });
}

//Handles approval of item with the given pid
exports.itemApproval = (req, res, next) => {
    let pid = req.params.pid;

    let sql = "UPDATE posts SET status = 1 WHERE pid = ?";

    db.query(sql, [pid], (err, result) => {
        if (err) {
            req.flash('error', 'Error approving item');
            res.redirect('/moderators/dashboard');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully approved item');
            res.redirect('/moderators/dashboard');
        }
        else {
            req.flash('error', 'Error approving item');
            res.redirect('/moderators/dashboard');
        }
    });
}

exports.confrimDelete = (req, res, next) => {
    let pid = req.params.pid;

    let sql = "SELECT pid, title, cover, image FROM posts WHERE pid = ?";

    db.query(sql, [pid], (err, result) => {
        if (err) throw err;

        numCache.getData()
            .then((count) => {
                res.render('confirmDeletion', { count: count, postInfo: result });
            }).catch((error) => {
                res.render('error');
            });
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

                fs.unlink('./public/images/upload/' + sampleImage, (err) => {
                    req.flash('success', 'Deleted Post Information.');
                    res.redirect('/moderators/dashboard');
                });
            });
        });
    });
}


exports.editPost_get = (req, res, next) => {
    let pid = req.params.pid;
    let links = {};
    let tags = {};
    let pCache = new cache.cache(post.getPostInfo, "pos", 0.005);

    typesCache.getData()
        .then((types) => {
            numCache.getData()
                .then((count) => {
                    pCache.getData(pid)
                        .then((result) => {
                            links.links = commas.addCommasLinks(result[1]);
                            tags.tags = commas.addCommasTags(result[2]);
                            res.render('editPostInfo', { count: count, postInfo: result[0], links: links, tags: tags, type: types });
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
                res.redirect('/moderators/dashboard');
            }

            if ((typeof result !== 'undefined')) {
                req.flash('success', 'Successfully updated post info.');
                res.redirect('/moderators/dashboard');
            }
            else {
                req.flash('error', 'Error updating post info.');
                res.redirect('/moderators/dashboard');
            }
        });
    });
}

exports.addImage_get = (req, res, next) => {
    let pid = req.params.pid;
    let pCache = new cache.cache(post.getPostImagesById, "pos", 0.005);

    numCache.getData()
        .then((count) => {
            pCache.getData(pid)
                .then((result) => {
                    res.render('editPostImage', { count: count, postInfo: result });
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
            res.redirect('/moderators/dashboard');
        }

        if ((typeof result !== 'undefined')) {
            if (skipCover) {
                if (skipWork) {
                    req.flash('success', 'Successfully updated image.');
                    res.redirect('/moderators/dashboard');
                } else {
                    fs.unlink('./public/images/upload/' + image, (err) => {
                        if (err) throw err;
                        req.flash('success', 'Successfully updated image.');
                        res.redirect('/moderators/dashboard');
                    });
                }
            } else {
                fs.unlink('./public/images/upload/' + cover, (err) => {
                    if (err) throw err;
                    if (skipWork) {
                        req.flash('success', 'Successfully updated image.');
                        res.redirect('/moderators/dashboard');
                    } else {
                        fs.unlink('./public/images/upload/' + image, (err2) => {
                            if (err2) throw err2;
                            req.flash('success', 'Successfully updated image.');
                            res.redirect('/moderators/dashboard');
                        });
                    }
                });
            }
        } else {
            req.flash('error', 'Error updating image.');
            res.redirect('/moderators/dashboard');
        }
    });
}