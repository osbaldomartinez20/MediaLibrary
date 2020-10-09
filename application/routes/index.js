//Contributors: Osbaldo Martinez
/* This file handles "/" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const getPostInfo = require('../controllers/getPostController');
const cache = require('../helper/dataCache');

//num cache that has data fpr the number of approved posts
let numCache = new cache.cache(getPostInfo.getNumberApproved, "1", 1);
//caches the 10 newest posts every 24 hours, so they might be the same as the newst 10 posts
//or might differ if new posts were approved
let postCache = new cache.cache(getPostInfo.homePagePosts, "2", 1440);

// GET home page
//this renders the home page and passes the count and post data to be handled
//by the frontend.
router.get('/', (req, res) => {
    numCache.getData()
        .then((count) => {
            postCache.getData()
                .then((posts) => {
                    if (posts.length < 10) {
                        postCache.destroyCache();
                    }
                    res.render('home', { count: count, post: posts });
                }).catch((error) => {
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
});


module.exports = router;