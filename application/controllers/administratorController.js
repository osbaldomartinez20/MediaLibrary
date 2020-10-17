//Contributors: Osbaldo Martinez
//modules used
const passport = require('passport');
const db = require('../config/db2');
const dbBackup = require('../config/dbbackup');
const cache = require('../helper/dataCache');
const post = require('./getPostController');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const separate = require('../helper/separeteByCommas');

//cache to get the number of approved posts
let numCache = new cache.cache(post.getNumberApproved, "2", 1);

// Display administrator's login page on GET
exports.login_get = (req, res, next) => {
    numCache.getData()
        .then((count) => {
            res.render('adminLogin', { count: count });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
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

//changes the admin's password
exports.changePassword = (req, res, next) => {
    let uid = req.user.aid;
    let { password, confirmPassword } = req.body;

    //make sure password is btwn 8 and 20 characters
    if (password.length < 8 || password.length > 20) {
        req.flash('error', 'Password must be between 8 and 20 characters.');
        res.redirect('/masteradmin/settings');
    }
    // Check if passwords match
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords must match.');
        res.redirect('/masteradmin/settings');
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }

        bcrypt.hash(password, salt, (err2, hash) => {
            if (err2) {
                req.flash('error', 'There was an internal error.');
                res.redirect('/error');
            }

            password = hash;

            //update password in db
            let sql = "UPDATE admin SET password = ? WHERE aid = ?";

            db.query(sql, [hash, uid], (error, result) => {
                if (error) {
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                }

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
        if (err) {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }

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
                req.flash('error', 'There was an internal error.');
                res.redirect('/error');
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

    //1 is approved
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

//deletes a post with the pid given in the request parameters
exports.itemDeletion = (req, res, next) => {
    let pid = req.params.pid;
    let skipCover = false;

    //get the post info
    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }

        //prepare sql to delete post info from tables.
        //posts table info has to be deleted last because
        //pid is a foreign key in the other tables.
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
                req.flash('error', 'There was an internal error.');
                res.redirect('/error');
            }

            if (!skipCover) {
                //cover is also deleted
                fs.unlink('./public/images/upload/' + coverImage, (err) => {
                    if (err) {
                        req.flash('error', 'There was an internal error.');
                        res.redirect('/error');
                    }

                    fs.unlink('./public/images/upload/' + sampleImage, (err2) => {
                        if (err2) {
                            req.flash('error', 'There was an internal error.');
                            res.redirect('/error');
                        }

                        req.flash('success', 'Deleted Post Information.');
                        res.redirect('/masteradmin/imagereview');
                    });
                });
            } else {
                //only work image is deleted
                fs.unlink('./public/images/upload/' + sampleImage, (err2) => {
                    if (err2) {
                        req.flash('error', 'There was an internal error.');
                        res.redirect('/error');
                    }

                    req.flash('success', 'Deleted Post Information.');
                    res.redirect('/masteradmin/imagereview');
                });
            }
        });
    });
}

//edits the information of the post with the pid given in the request body.
exports.editPost_post = (req, res, next) => {
    let { pid, title, jtitle, author, description, details, type, tags, links } = req.body;
    let japTitle = "";
    let placeholders = [];

    if (jtitle) {
        japTitle = jtitle;
    }

    //Delete tags and links with the pid, because we will be re entering them into database
    let sqlDel = "DELETE FROM links WHERE pid = ?; DELETE FROM tags WHERE pid = ?";

    let delPlaceholders = [pid, pid];

    db.query(sqlDel, delPlaceholders, (error, result) => {
        if (error) {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }

        let linksList = separate.separateLinks(links);
        let tagsList = separate.separateTags(tags);

        //update the post info in the posts table.
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

//changes the images of the posts for the given pid found in the request body.
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

    //check the work image info to see if we are replacing it.
    if (newImages.mangaImage != undefined) {
        workImage = newImages.mangaImage[0].filename;
        skipWork = false;
        sql += ", image = ?";
        placeholders.push(workImage);
    }

    //check to see if we skip current cover image deletion
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
                    //we delete nothing
                    req.flash('success', 'Successfully updated image.');
                    res.redirect('/masteradmin/imagereview');
                } else {
                    //we delete only the work image
                    fs.unlink('./public/images/upload/' + image, (err) => {
                        if (err) {
                            req.flash('error', 'There was an internal error.');
                            res.redirect('/error');
                        }
                        req.flash('success', 'Successfully updated image.');
                        res.redirect('/masteradmin/imagereview');
                    });
                }
            } else {
                fs.unlink('./public/images/upload/' + cover, (err) => {
                    if (err) {
                        req.flash('error', 'There was an internal error.');
                        res.redirect('/error');
                    }
                    if (skipWork) {
                        //we only delete the cover image
                        req.flash('success', 'Successfully updated image.');
                        res.redirect('/masteradmin/imagereview');
                    } else {
                        //we delete both images
                        fs.unlink('./public/images/upload/' + image, (err2) => {
                            if (err2) {
                                req.flash('error', 'There was an internal error.');
                                res.redirect('/error');
                            }
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

//add a new TSF type to the tsftypes table
exports.addNewType = (req, res, next) => {
    let { newType } = req.body;
    //we make sure other is the last item in the table.
    let sql = "DELETE FROM tsftypes WHERE name = ?;";
    sql += "INSERT INTO tsftypes (name) VALUES (?);"
    sql += "INSERT INTO tsftypes (name) VALUES (?);"
    let placeholders = ["Other", newType, "Other"];

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }

        req.flash("success", "Successfully added a new type.");
        res.redirect('/masteradmin/settings');
    });
}

//add a new origin to the origin table
exports.addNewOrigin = (req, res, next) => {
    let { newOrigin } = req.body;
    //make sure that other is the last item in the table
    let sql = "DELETE FROM origin WHERE name = ?;";
    sql += "INSERT INTO origin (name) VALUES (?);"
    sql += "INSERT INTO origin (name) VALUES (?);"
    let placeholders = ["Other", newOrigin, "Other"];

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }

        req.flash("success", "Successfully added a new origin.");
        res.redirect('/masteradmin/settings');
    });
}

//finds the post with the given pid in the request body
exports.findPostById = (req, res, next) => {
    let { pid } = req.body;
    res.redirect('/libraryitem/' + pid + '/moderator');
}

//makes a back up of the database tables, except the admin and mod tables.
exports.backupDB = (req, res, next) => {
    dbBackup.createNewDBBackup();
    req.flash('success', 'Successfully backed up the database');
    res.redirect('/masteradmin/settings');
}
