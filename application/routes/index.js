/* This file handles "/" route */

const express = require('express');
const router = express.Router();
//const db = require('../config/db');

// GET home page
router.get('/', (req, res) => {
    res.render('home');
});

module.exports = router;