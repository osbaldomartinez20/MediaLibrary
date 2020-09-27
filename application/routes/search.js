/* This file handles "/search" route */

const express = require('express');
const { route } = require('.');
const router = express.Router();
const searchController = require('../controllers/searchController');


// POST request for search
router.post('/', searchController.post);

router.get('/:character/firstletter', searchController.firstLetter);

module.exports = router;