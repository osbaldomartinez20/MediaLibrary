//Contributors: Osbaldo Martinez
/* This file handles "/tag" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const tags = require('../controllers/tagController');

//GET request to display tags with their count.
router.get('/', tags.getTagsNumbered);

//POST request to add the new tags to the database
router.post('/update', tags.updateTags);

//GET request to add tags to a post
router.get('/:pid/add', tags.addTags);

module.exports = router;