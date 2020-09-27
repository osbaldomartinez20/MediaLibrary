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
        console.time("h");
        postCache.getData()
        .then((posts) => {
            if(posts.length < 10) {
                postCache.destroyCache();
            }
            console.timeEnd("h");
            res.render('home', {count: count, post: posts});
        }).catch((error) => {
            res.sendStatus(503);});
    }).catch((error) => {
        res.sendStatus(503);});
});


module.exports = router;