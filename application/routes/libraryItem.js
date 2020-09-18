/* This file handles "/imageCard" route */

const express = require('express');
const router = express.Router();
const { ensureUserAuthenticated } = require('../controllers/userAuthenticated');
const imageCardController = require('../controllers/imageCardController');

// GET image page
router.get('/:pid', imageCardController.imageCard_get);

// GET request to edit image info
router.get('/:pid/edit', ensureUserAuthenticated, imageCardController.edit_get);

//POST request to update database
router.post('/:pid/update', ensureUserAuthenticated, imageCardController.edit_post);

//GET to obtain information of post being deleted.
router.get('/:pid/confirmDelete', ensureUserAuthenticated, imageCardController.confirm_get);

//GET to delete post
router.get('/:pid/delete', ensureUserAuthenticated, imageCardController.delete_get);

module.exports = router;