//Contributors: Osbaldo Martinez
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

//caches for information that is used in the rendered pages.
let numCache = new cache.cache(post.getNumberApproved, "2", 1);
let typesCache = new cache.cache(types.retrieve, "1", 1440);
let originCache = new cache.cache(types.originGet, "5", 1440);

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
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
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

//renders the settings page
exports.settings = (req, res, next) => {
    numCache.getData()
        .then((count) => {
            res.render('modAdminSettings', { count: count });
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
}

//changes the mod password with the given id in the user
exports.changePassword = (req, res, next) => {
    let uid = req.user.id;
    let { password, confirmPassword } = req.body;

    //check if password is btwn 8 and 20 characters
    if (password.length < 8 || password.length > 20) {
        req.flash('error', 'Password must be between 8 and 20 characters.');
        res.redirect('/moderators/settings');
    }
    // Check if passwords match
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords must match.');
        res.redirect('/moderators/settings');
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }

        bcrypt.hash(password, salt, (err2, hash) => {
            if (err2) {
                fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err2 + '');
                req.flash('error', 'There was an internal error.');
                res.redirect('/error');
            }

            password = hash;

            let sql = "UPDATE mods SET password = ? WHERE id = ?"

            db.query(sql, [hash, uid], (error, result) => {
                if (error) {
                    fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                }

                req.flash('success', 'Successfully changed password');
                res.redirect('/moderators/dashboard');
            });
        });
    });
}

// Handle showing registration page for mod on GET
exports.register_get = (req, res, next) => {
    numCache.getData()
        .then((count) => {
            res.render('register', { count: count });
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
}

// Handle registration for mod on POST
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
                    if (err) {
                        fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
                        req.flash('error', 'There was an internal error.');
                        res.redirect('/error');
                    }

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
                            if (err) {
                                fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err2 + '');
                                req.flash('error', 'There was an internal error.');
                                res.redirect('/error');
                            }

                            bcrypt.hash(password, salt, (err2, hash) => {
                                if (err2) {
                                    fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err2 + '');
                                    req.flash('error', 'There was an internal error.');
                                    res.redirect('/error');
                                }

                                password = hash;

                                // Insert new user into database
                                db.query("INSERT INTO mods (id, username, password, status) VALUES (?, ?, ?, ?)", [uid, username, password, 0], (error, result) => {
                                    if (error) {
                                        fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
                                        req.flash('error', 'There was an internal error.');
                                        res.redirect('/error');
                                    }

                                    req.flash('success', 'Successfully Submitted Your Mod Account For Review.');
                                    res.redirect('/moderators/login');
                                });
                            });
                        });
                    }
                });
            }
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });

}

// Handle mod logout on GET
exports.logout = (req, res, next) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
}

// Display mod's dashboard page on GET
// Retrieve list of posts that have not been approved
exports.dashboard = (req, res, next) => {

    let sql = "SELECT pid, title, cover, image FROM posts WHERE status = 0";

    db.query(sql, (error, result) => {
        if (error) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }
        numCache.getData()
            .then((count) => {
                res.render('userDashboard', {
                    post: result,
                    count: count
                });
            }).catch((err) => {
                fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
                req.flash('error', 'There was an internal error.');
                res.redirect('/error');
            });

    });
}

//Handles approval of post with the given pid
exports.itemApproval = (req, res, next) => {
    let pid = req.params.pid;

    let sql = "UPDATE posts SET status = 1 WHERE pid = ?";

    db.query(sql, [pid], (err, result) => {
        if (err) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            req.flash('error', 'Error approving post');
            res.redirect('/moderators/dashboard');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully approved post');
            res.redirect('/moderators/dashboard');
        }
        else {
            req.flash('error', 'Error approving post');
            res.redirect('/moderators/dashboard');
        }
    });
}

//Handles disapproval of post with the given pid
exports.itemDisapproval = (req, res, next) => {
    let pid = req.params.pid;

    let sql = "UPDATE posts SET status = 0 WHERE pid = ?";

    db.query(sql, [pid], (err, result) => {
        if (err) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            req.flash('error', 'Error approving post');
            res.redirect('/moderators/dashboard');
        }

        if (result.changedRows > 0) {
            req.flash('success', 'Sucessfully approved post');
            res.redirect('/moderators/dashboard');
        }
        else {
            req.flash('error', 'Error approving post');
            res.redirect('/moderators/dashboard');
        }
    });
}

//renders the confirmDeletion page of the post with the given pid
exports.confrimDelete = (req, res, next) => {
    let pid = req.params.pid;

    let sql = "SELECT pid, title, cover, image FROM posts WHERE pid = ?";

    db.query(sql, [pid], (err, result) => {
        if (err) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }

        numCache.getData()
            .then((count) => {
                res.render('confirmDeletion', { count: count, postInfo: result });
            }).catch((error) => {
                fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
                req.flash('error', 'There was an internal error.');
                res.redirect('/error');
            });
    });

}

//Handles deletion of post with the given pid
exports.itemDeletion = (req, res, next) => {
    let pid = req.params.pid;
    let skipCover = false;

    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }

        sql = "DELETE FROM tags WHERE pid = ?;";
        sql += "DELETE FROM links WHERE pid = ?;";
        sql += "DELETE FROM posts WHERE pid = ?;"

        let coverImage = result[0].cover;
        let sampleImage = result[0].image;

        //check if the cover image is the default one
        //if it is the default one, skipCover = true, so that we do not delete noCover.png
        if (coverImage == "noCover.png") {
            skipCover = true;
        }

        db.query(sql, [pid, pid, pid], (error2, result2) => {
            if (error2) {
                fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error2 + '');
                req.flash('error', 'There was an internal error.');
                res.redirect('/error');
            }

            if (!skipCover) {
                //cover is also deleted
                fs.unlink('./public/images/upload/' + coverImage, (err) => {
                    if (err) {
                        fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
                        req.flash('error', 'There was an internal error.');
                        res.redirect('/error');
                    }

                    fs.unlink('./public/images/upload/' + sampleImage, (err2) => {
                        if (err2) {
                            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err2 + '');
                            req.flash('error', 'There was an internal error.');
                            res.redirect('/error');
                        }

                        req.flash('success', 'Deleted Post Information. Changes may apply after 30 min.');
                        res.redirect('/masteradmin/imagereview');
                    });
                });
            } else {
                //only work image is deleted
                fs.unlink('./public/images/upload/' + sampleImage, (err2) => {
                    if (err2) {
                        fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err2 + '');
                        req.flash('error', 'There was an internal error.');
                        res.redirect('/error');
                    }

                    req.flash('success', 'Deleted Post Information. Changes may apply after 30 min.');
                    res.redirect('/masteradmin/imagereview');
                });
            }
        });
    });
}

//renders page to edit post info of the post with the given pid.
//returns the links and tags with a single strings for each with proper commas.
exports.editPost_get = (req, res, next) => {
    let pid = req.params.pid;
    let links = {};
    let tags = {};

    //get origin table data
    originCache.getData()
        .then((orig) => {
            //get types from tsftypes tables
            typesCache.getData()
                .then((types) => {
                    //get number of approved posts
                    numCache.getData()
                        .then((count) => {
                            //get post info
                            post.getPostInfo(pid)
                                .then((result) => {
                                    links.links = commas.addCommasLinks(result[1]);
                                    tags.tags = commas.addCommasTags(result[2]);
                                    res.render('editPostInfo', { count: count, postInfo: result[0], links: links, tags: tags, type: types, origin: orig });
                                }).catch((err) => {
                                    fs.writeFileSync(__dirname + '/' + Date.now() + 'error.log', err + '');
                                    req.flash('error', 'There was an internal error.');
                                    res.redirect('/error');
                                });
                        }).catch((err) => {
                            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
                            req.flash('error', 'There was an internal error.');
                            res.redirect('/error');
                        });
                }).catch((err) => {
                    fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((err) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
}

//updates the post with the given pid with the given information in the form.
exports.editPost_post = (req, res, next) => {
    let { pid, title, jtitle, author, description, details, year, unknown, type, origin, tags, links } = req.body;
    let mod = req.user.username;
    let japTitle = "";
    let placeholders = [];

    if (jtitle) {
        japTitle = jtitle;
    }

    if(unknown) {
        year = "Unknown";
    }

    let sqlDel = "DELETE FROM links WHERE pid = ?; DELETE FROM tags WHERE pid = ?";

    let delPlaceholders = [pid, pid];

    db.query(sqlDel, delPlaceholders, (error, result) => {
        if (error) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }

        let linksList = separate.separateLinks(links);
        let tagsList = separate.separateTags(tags);

        let sql = "UPDATE posts SET title = ?, jtitle = ?, author = ?, description = ?, details = ?, type = ?, origin = ?, approvedby = ?, year = ? WHERE pid = ?;";
        let postPlaceholders = [title, japTitle, author, description, details, type, origin, mod, year, pid];
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
                fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            }
        });
        req.flash('success', 'Successfully updated post info. Changes may apply after 30 min.');
        res.redirect('/moderators/dashboard');
    });
}

//gets post pid, image, and cover and renders the page to change the images.
exports.addImage_get = (req, res, next) => {
    let pid = req.params.pid;

    numCache.getData()
        .then((count) => {
            post.getPostImagesById(pid)
                .then((result) => {
                    res.render('editPostImage', { count: count, postInfo: result });
                }).catch((err) => {
                    fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((err) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
}

//changes the images of the post with the given image/s
//for more documentation look at the similar function in administratorController.js
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

    if(newImages.coverImage == undefined) {
        req.flash('error', 'Error only jpg or png images accepted.');
        res.redirect('/moderators/dashboard');
    }

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
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
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
                        if (err) {
                            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
                            req.flash('error', 'There was an internal error.');
                            res.redirect('/error');
                        }
                        req.flash('success', 'Successfully updated image.');
                        res.redirect('/moderators/dashboard');
                    });
                }
            } else {
                fs.unlink('./public/images/upload/' + cover, (err) => {
                    if (err) {
                        fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
                        req.flash('error', 'There was an internal error.');
                        res.redirect('/error');
                    }
                    if (skipWork) {
                        req.flash('success', 'Successfully updated image.');
                        res.redirect('/moderators/dashboard');
                    } else {
                        fs.unlink('./public/images/upload/' + image, (err2) => {
                            if (err2) {
                                fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err2 + '');
                                req.flash('error', 'There was an internal error.');
                                res.redirect('/error');
                            }
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

//shows all the posts in the database
exports.showAll = (req, res, next) => {
    numCache.getData()
    .then((count) => {
        post.getAll()
        .then((result) => {
            res.render('allPostsMod', {count: count, post: result});
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
    }).catch((error) => {
        fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        req.flash('error', 'There was an internal error.');
        res.redirect('/error');
    });
}
