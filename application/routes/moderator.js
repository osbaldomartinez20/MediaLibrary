//Contributors: Osbaldo Martinez
/* This file handles "/moderators" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const userController = require('../controllers/moderatorController');
const { ensureUserAuthenticated, forwardAuthenticated } = require('../controllers/userAuthenticated');
const postImageUpload = require('../middlewares/postImageUpload');

// GET request to redirect to student login page
router.get('/', (req, res) => {
    res.redirect('/moderators/login');
});

// GET mod's login page
router.get('/login', forwardAuthenticated, userController.login_get);

// POST request for authenticating mod login
router.post('/login', userController.login_post);

// GET mod registration page
router.get('/register', forwardAuthenticated, userController.register_get);

// POST request for mod registration page
router.post('/register', userController.register_post);

// GET request for mod logout
router.get('/logout', ensureUserAuthenticated, userController.logout);

// GET moderator's dashboard page
router.get('/dashboard', ensureUserAuthenticated, userController.dashboard);

// GET request for post approval
router.get('/:pid/approve', ensureUserAuthenticated, userController.itemApproval);

// GET request to get page to confirm deletion
router.get('/:pid/confirmdel', ensureUserAuthenticated, userController.confrimDelete);

// GET request to delete post
router.get('/:pid/delete', ensureUserAuthenticated, userController.itemDeletion);

// GET request to get page to edit post info
router.get('/:pid/edit', ensureUserAuthenticated, userController.editPost_get);

// POST request to change post info
router.post('/edit', ensureUserAuthenticated, userController.editPost_post);

// GET request to get page to change post images
router.get('/:pid/addimage', ensureUserAuthenticated, userController.addImage_get);

// POST request to change post images 
router.post('/addimage', ensureUserAuthenticated, postImageUpload.fields([{name:'coverImage', maxCount: 1}, {name:'mangaImage', maxCount: 1}]), userController.addImage_post);

module.exports = router;