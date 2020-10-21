//Contributors: Osbaldo Martinez
/* This file handles "/" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const getPostInfo = require('../controllers/getPostController');
const cache = require('../helper/dataCache');
const types = require('../controllers/typeController');
const fs = require('fs');

//num cache that has data fpr the number of approved posts
let numCache = new cache.cache(getPostInfo.getNumberApproved, "1", 1);
//caches the 10 newest posts every 24 hours, so they might be the same as the newst 10 posts
//or might differ if new posts were approved
let postCache = new cache.cache(getPostInfo.homePagePosts, "2", 1440);

let originCache = new cache.cache(types.originGet, "5", 30);
let typesCache = new cache.cache(types.retrieve, "1", 30);

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
                    originCache.getData()
                        .then((origins) => {
                            typesCache.getData()
                                .then((types) => {
                                    res.render('home', { count: count, post: posts, origins: origins, types: types });
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
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
});

// GET about page
//this renders the about page and passes the count data to be handled
//by the frontend.
router.get('/about', (req, res) => {
    numCache.getData()
        .then((count) => {
            res.render('about', { count: count });
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
});

module.exports = router;