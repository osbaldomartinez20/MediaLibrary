/* This file handles "/post" route */

const express = require('express');
const router = express.Router();
//const { ensureUserAuthenticated } = require('../controllers/userAuthenticated');
const imagePostController = require('../controllers/imagePostController');
const postImageUpload = require('../middlewares/postImageUpload');

// GET submit page
router.get('/', imagePostController.imagePost_get);

// POST request for submit page
router.post('/', postImageUpload.fields([{name:'coverImage', maxCount: 1}, {name:'mangaImage', maxCount: 1}]), imagePostController.imagePost_post);

module.exports = router;