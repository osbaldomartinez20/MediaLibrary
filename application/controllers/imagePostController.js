const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Handle showing sell page on GET
exports.imagePost_get = (req, res, next) => {
    res.render('imagePost');
}

// Handle submitting sales item for sell on POST
exports.imagePost_post = (req, res, next) => {
    let postId = uuidv4();
    let { title, japTitle, author, publication, description, tags, type } = req.body;
    let postImage = req.file.filename;
    let postError = [];

    // Check if required fields are filled
    if (!title || !description || !author || !tags || !type || !publication) {
        postError.push({ message: 'Please fill in all non-optional fields' });
    }
    //Check if there is image 
    else if (!postImage || postImage == undefined) {
        postError.push({ message: 'Please select an image.' });
    }

    if(!japTitle) {
        japTitle = "NULL";
    }

    // Render posting error messages if necessary
    if (postError.length > 0) {
        res.render('imagePost', {
            postError: postError
        });
    }


    let sql = "INSERT INTO posts (pid, title, description, userid, filename, user) VALUES (?,?,?,?,?,?)";

    db.query(sql, [postId, title, description, userid, postImage, user], (err, result) => {
        if (err) {
            req.flash('error', 'Error posting');
            res.render('imagePost');
        }

        if ((typeof result !== 'undefined')) {
            req.flash('success', 'Successfully submitted for review');
            res.redirect('/');
        }
        else {
            req.flash('error', 'Error posting');
            res.redirect('/post');
        }
    });

}
