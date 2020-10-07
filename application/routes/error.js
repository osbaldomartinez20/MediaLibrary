/* This file handles "/error" route */

const express = require('express');
const router = express.Router();
const getPostInfo = require('../controllers/getPostController');
const cache = require('../helper/dataCache');
var fs = require('fs');


let numCache = new cache.cache(getPostInfo.getNumberApproved, "1", 1);


// GET error page
router.get('/', (req, res) => {
    numCache.getData()
        .then((count) => {
            res.render('error', { count: count });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
});


module.exports = router;