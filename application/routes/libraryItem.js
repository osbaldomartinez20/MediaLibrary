/* This file handles "/imageCard" route */

const express = require('express');
const router = express.Router();
const imageCardController = require('../controllers/itemCardController');

// GET image page
router.get('/:pid', imageCardController.imageCard_get);

// GET image page
router.get('/:pid/moderator', imageCardController.imageCardMod_get);

module.exports = router;