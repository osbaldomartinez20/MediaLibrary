const db = require('../config/db2');
const types = require('./typeController');
const cache = require('../helper/dataCache');
const separate = require('../helper/separeteByCommas');
const getCount = require('../controllers/getPostController');
const { v4: uuidv4 } = require('uuid');
let typesCache = new cache.cache(types.retrieve, "1", 1440);
let numCache = new cache.cache(getCount.getNumberApproved, "2", 1);

// Handle showing submit page on GET
exports.imagePost_get = (req, res, next) => {
    console.time("time");
    typesCache.getData()
        .then((result) => {
            numCache.getData()
            .then((count) => {
                res.render('imagePost', { type: result, count: count});
            }).catch((error) => {
                res.sendStatus(503);});
        }).catch((error) => {
            res.sendStatus(503);});
}

// Handle submitting sales item for submit on POST
exports.imagePost_post = (req, res, next) => {
    let postId = uuidv4();
    let { title, japTitle, author, publication, description, tags, links, type } = req.body;
    let postImages = req.files;
    let postCover = "noCover.png";
    let postImage = postImages.mangaImage[0].filename;
    let postError = [];
    let status = 0;
    let placeholders = [];

    //check if the user added a cover for the media work.
    if (postImages.coverImage != undefined) {
        postCover = postImages.coverImage[0].filename;
    }


    // Check if required fields are filled
    if (!title || !description || !author || !tags || !type || !publication || !links) {
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

    let sql = "INSERT INTO posts (pid, title, author, jtitle, description, details, type, cover, image, status, date) VALUES (?,?,?,?,?,?,?,?,?,?,STR_TO_DATE(?,'%Y/%m/%d %H:%i:%s'));";
    let postPlaceholder = [postId, title, author, japTitle, description, publication, type, postCover, postImage, status, insertDate];

    placeholders.push(...postPlaceholder);

    let tempId;//a tempId value to hold the newly generated id of links and tags.

    //generate the SQL for the links insertion.
    for(let i = 0; i < linksList.length; i++) {
        tempId = uuidv4();
        sql += "INSERT INTO links (lid, links, pid) VALUES (?,?,?);";
        placeholders.push(tempId);
        placeholders.push(linksList[i]);
        placeholders.push(postId);
    }

    //generate the SQL for the links insertion.
    for(let j = 0; j < tagsList.length; j++) {
        tempId = uuidv4();
        sql += "INSERT INTO tags (tgid, tags, pid) VALUES (?,?,?);";
        placeholders.push(tempId);
        placeholders.push(tagsList[j]);
        placeholders.push(postId);
    }

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            req.flash('error', 'Error posting');
            res.redirect('/submit');
        }

        if ((typeof result !== 'undefined')) {
            req.flash('success', 'Successfully submitted for review');
            res.redirect('/');
        }
        else {
            req.flash('error', 'Error posting');
            res.redirect('/submit');
        }
    });
}
