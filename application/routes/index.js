/* This file handles "/" route */

const express = require('express');
const router = express.Router();
const getPostInfo = require('../controllers/getPostController');
const cache = require('../helper/dataCache');

let numCache = new cache.cache(getPostInfo.getNumberApproved, "1", 1);
let postCache = new cache.cache(getPostInfo.homePagePosts, "2", 1440);

// GET home page
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