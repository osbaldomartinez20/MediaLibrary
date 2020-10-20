//Contributors: Osbaldo Martinez
/* This file handles "/libraryitem" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const imageCardController = require('../controllers/itemCardController');

// GET post page
router.get('/:pid', imageCardController.imageCard_get);

// GET post page for moderators, meaning no cache for the post.
router.get('/:pid/moderator', imageCardController.imageCardMod_get);

//GET random post page
router.get('/:ignore/any', imageCardController.getRandomPost);

module.exports = router;