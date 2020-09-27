/* This file handles "/search" route */

const express = require('express');
const { route } = require('.');
const router = express.Router();
const searchController = require('../controllers/searchController');


// POST request for search
router.post('/', searchController.post);

//GET requests for search
router.get('/:character/firstletter', searchController.findByFirstLetter);
router.get('/:type/bytype', searchController.findByType);

module.exports = router;