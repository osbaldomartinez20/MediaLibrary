/* This file handles "/user" route */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/moderatorController');
const { ensureUserAuthenticated, forwardAuthenticated } = require('../controllers/userAuthenticated');
const postImageUpload = require('../middlewares/postImageUpload');

// GET request to redirect to student login page
router.get('/', (req, res) => {
    res.redirect('/moderators/login');
});

// GET student's login page
router.get('/login', forwardAuthenticated, userController.login_get);

// POST request for authenticating student login
router.post('/login', userController.login_post);

// GET student registration page
router.get('/register', forwardAuthenticated, userController.register_get);

// POST request for student registration page
router.post('/register', userController.register_post);

// GET request for student logout
router.get('/logout', ensureUserAuthenticated, userController.logout);

// GET moderator's dashboard page
router.get('/dashboard', ensureUserAuthenticated, userController.dashboard);

// GET request for item approval
router.get('/:pid/approve', ensureUserAuthenticated, userController.itemApproval);

router.get('/:pid/confirmdel', ensureUserAuthenticated, userController.confrimDelete);

router.get('/:pid/delete', ensureUserAuthenticated, userController.itemDeletion);

router.get('/:pid/edit', ensureUserAuthenticated, userController.editPost_get);

router.post('/edit', ensureUserAuthenticated, userController.editPost_post);

router.get('/:pid/addimage', ensureUserAuthenticated, userController.addImage_get);

router.post('/addimage', ensureUserAuthenticated, postImageUpload.fields([{name:'coverImage', maxCount: 1}, {name:'mangaImage', maxCount: 1}]), userController.addImage_post);

module.exports = router;