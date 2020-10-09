//Contributors: Osbaldo Martinez
/* This file handles "/search" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

//Only posts that have been approved will be returned

//POST request for search

//finds posts with a given keywork in request body
router.post('/', searchController.post);

//GET requests for search

//finds the posts that start with the given character
router.get('/:character/firstletter', searchController.findByFirstLetter);
//finds the posts that have the given type
router.get('/:type/bytype', searchController.findByType);
//finds the posts that have the given tag
router.get('/:tag/bytag', searchController.findByTag);
//finds the posts that have the given origin
router.get('/:origin/byorigin', searchController.findByOrigin);
//finds the 10 newst posts
router.get('/newest', searchController.getNewest);

module.exports = router;