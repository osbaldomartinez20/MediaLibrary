/* This file handles "/" route */

const express = require('express');
const router = express.Router();
const getCount = require('../controllers/getPostController');
const cache = require('../helper/dataCache');

let numCache = new cache.cache(getCount.getNumberApproved, "1", 1);

// GET home page
router.get('/', (req, res) => {
    numCache.getData()
    .then((result) => {
        res.render('home', {count: result});
    });
});


module.exports = router;