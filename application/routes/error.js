//Contributors: Osbaldo Martinez
/* This file handles "/error" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const getPostInfo = require('../controllers/getPostController');
const cache = require('../helper/dataCache');
const fs = require('fs');

//num cache that holds the cache for the number of posts approved
let numCache = new cache.cache(getPostInfo.getNumberApproved, "1", 1);


// GET error page
//All errors in the web app are redirected to this GET function.
router.get('/', (req, res) => {
    numCache.getData()
        .then((count) => {
            res.render('error', { count: count });
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            //I would be surprised if somehow this causes an infinite loop.
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
});


module.exports = router;