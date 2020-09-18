/* This file handles "/search" route */

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// POST request for search
router.post('/', searchController.post);

module.exports = router;