const db = require('../config/db');
const types = require('./typeController');
let cache = require('./cacheController');
const { v4: uuidv4 } = require('uuid');
const typesCache = new cache.cache(types.retrieve, 1440);

// Handle showing sell page on GET
exports.imagePost_get = (req, res, next) => {
    console.time("time");
    typesCache.getData()
        .then((result) => {
            console.timeEnd("time");
            res.render('imagePost', {type: result});
        });
}

// Handle submitting sales item for sell on POST
exports.imagePost_post = (req, res, next) => {
    let postId = uuidv4();
    let { title, japTitle, author, publication, description, tags, type } = req.body;
    let postImage = req.files;
    let postCover = "";
    let postError = [];

    // Check if required fields are filled
    if (!title || !description || !author || !tags || !type || !publication) {
        postError.push({ message: 'Please fill in all non-optional fields' });
    }
    //Check if there is image 
    else if (!postImage || postImage == undefined) {
        postError.push({ message: 'Please select an image.' });
    }

    //Check if we have a japanese title
    if(!japTitle) {
        japTitle = "NULL";
    }

    // Render posting error messages if necessary
    if (postError.length > 0) {
        res.render('imagePost', {
            postError: postError
        });
    }


    let sql = "INSERT INTO posts (pid, title, jtitle, description, details, type, cover, image) VALUES (?,?,?,?,?,?, ?, ?)";

    db.query(sql, [postId, title, japTitle, description, type, publication, postCover, postImage], (err, result) => {
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
