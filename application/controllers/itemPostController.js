//Contributors: Osbaldo Martinez
// Show image page on GET for the post of the given post id in the parameters
const db = require('../config/db2');
const types = require('./typeController');
const cache = require('../helper/dataCache');
const separate = require('../helper/separeteByCommas');
const getCount = require('../controllers/getPostController');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

//caches for information that is used in the rendered pages.
let typesCache = new cache.cache(types.retrieve, "1", 30);
let numCache = new cache.cache(getCount.getNumberApproved, "2", 1);
let originCache = new cache.cache(types.originGet, "5", 30);

// Handle showing submit page on GET
exports.imagePost_get = (req, res, next) => {
    typesCache.getData()
        .then((result) => {
            numCache.getData()
                .then((count) => {
                    originCache.getData()
                        .then((orig) => {
                            res.render('imagePost', { type: result, count: count, origin: orig });
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
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
}

// Handle submitting sales item for submit on POST
exports.imagePost_post = (req, res, next) => {
    let postId = uuidv4();
    let { title, japTitle, author, publication, description, year, unknown, tags, links, type, origin } = req.body;
    let postImages = req.files;
    let postCover = "noCover.png";
    let postImage = "nothing.png";
    let postError = [];
    let status = 0;
    let placeholders = [];

    if (postImages.mangaImage != undefined) {
        postImage = postImages.mangaImage[0].filename;
    } else {
        req.flash('error', 'Error only jpg or png images accepted.');
        res.redirect('/submit')
    }

    //check if the user added a cover for the media work.
    if (postImages.coverImage != undefined) {
        postCover = postImages.coverImage[0].filename;
    }


    // Check if required fields are filled
    if (!title || !description || !author || !tags || !type || !publication || !links || !origin) {
        postError.push({ message: 'Please fill in all non-optional fields' });
    }
    //Check if there is image 
    else if (!postImages || postImages == undefined) {
        postError.push({ message: 'Please select an image.' });
    }

    //Check if we don't have a japanese title
    if (!japTitle) {
        japTitle = "";
    }

    //check to see if unknown is checked
    if (unknown) {
        year = "Unknown";
    }

    // Render posting error messages if necessary
    if (postError.length > 0) {
        req.flash('error', 'Error posting');
        res.redirect('/submit');
    }

    let linksList = separate.separateLinks(links);
    let tagsList = separate.separateTags(tags);

    //get the date the post was submitted.
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1; //counts months begining at 0, so we need a +1 offset
    let yyyy = date.getFullYear();
    let hh = date.getHours();
    let mi = date.getMinutes();
    let ss = date.getSeconds();


    let insertDate = yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + mi + ':' + ss;

    let sql = "INSERT INTO posts (pid, title, author, jtitle, description, details, type, cover, image, status, date, origin, year, reviewable) VALUES (?,?,?,?,?,?,?,?,?,?,STR_TO_DATE(?,'%Y/%m/%d %H:%i:%s'),?,?,?);";
    let postPlaceholder = [postId, title, author, japTitle, description, publication, type, postCover, postImage, status, insertDate, origin, year, 1];

    placeholders.push(...postPlaceholder);

    let tempId;//a tempId value to hold the newly generated id of links and tags.

    //generate the SQL for the links insertion.
    for (let i = 0; i < linksList.length; i++) {
        tempId = uuidv4();
        sql += "INSERT INTO links (lid, links, pid) VALUES (?,?,?);";
        placeholders.push(tempId);
        placeholders.push(linksList[i]);
        placeholders.push(postId);
    }

    //generate the SQL for the tags insertion.
    for (let j = 0; j < tagsList.length; j++) {
        tempId = uuidv4();
        sql += "INSERT INTO tags (tgid, tags, pid) VALUES (?,?,?);";
        placeholders.push(tempId);
        placeholders.push(tagsList[j]);
        placeholders.push(postId);
    }

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            req.flash('error', 'Error posting');
            res.redirect('/submit');
        }

        req.flash('success', 'Successfully submitted for review');
        res.redirect('/');

    });
}
