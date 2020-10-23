//Contributors: Osbaldo Martinez
/* This file handles "/tag" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const tags = require('../controllers/tagController');

//GET request to display tags with their count.
router.get('/', tags.getTagsNumbered);

module.exports = router;