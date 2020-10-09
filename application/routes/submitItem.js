//Contributors: Osbaldo Martinez
/* This file handles "/submit" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const itemPostController = require('../controllers/itemPostController');
const postImageUpload = require('../middlewares/postImageUpload');

// GET submit page
router.get('/', itemPostController.imagePost_get);

// POST request for submit page
router.post('/', postImageUpload.fields([{name:'coverImage', maxCount: 1}, {name:'mangaImage', maxCount: 1}]), itemPostController.imagePost_post);

module.exports = router;