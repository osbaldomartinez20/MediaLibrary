/* This file handles "/user" route */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureUserAuthenticated, forwardAuthenticated } = require('../controllers/userAuthenticated');

// GET request to redirect to student login page
router.get('/', (req, res) => {
    res.redirect('/moderator/login');
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

// GET student's dashboard page
router.get('/dashboard', ensureUserAuthenticated, userController.dashboard);

module.exports = router;