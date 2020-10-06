/* This file handles "/admin" route */

const express = require('express');
const router = express.Router();
const administratorController = require('../controllers/administratorController');
const modFunctions = require('../controllers/moderatorController');
const { ensureAdminAuthenticated, forwardAuthenticated } = require('../controllers/userAuthenticated');
const postImageUpload = require('../middlewares/postImageUpload');

// GET request to redirect to admin login page
router.get('/', (req, res) => {
    res.redirect('/masteradmin/login');
});

// GET administrator's login page
router.get('/login', forwardAuthenticated, administratorController.login_get);

// POST request for authenticating administrator login
router.post('/login', administratorController.login_post);

// GET request for administrator logout
router.get('/logout', ensureAdminAuthenticated, administratorController.logout);

router.get('/settings', ensureAdminAuthenticated, modFunctions.settings);

router.post('/changepass', ensureAdminAuthenticated, administratorController.changePassword);

// GET administrator's dashboard page
router.get('/dashboard', ensureAdminAuthenticated, administratorController.dashboard);

router.get('/imagereview', ensureAdminAuthenticated, modFunctions.dashboard);

// GET request for approving sales item
router.get('/:mid/approve', ensureAdminAuthenticated, administratorController.approve);

// GET request for disapproving sales item
router.get('/:mid/disapprove', ensureAdminAuthenticated, administratorController.disapprove);

// GET request for removing sales item
router.get('/:mid/remove', ensureAdminAuthenticated, administratorController.remove);

router.get('/:pid/itemapprove', ensureAdminAuthenticated, administratorController.itemApproval);

router.get('/:pid/itemconfirmdel', ensureAdminAuthenticated, modFunctions.confrimDelete);

router.get('/:pid/itemdelete', ensureAdminAuthenticated, administratorController.itemDeletion);

router.get('/:pid/itemedit', ensureAdminAuthenticated, modFunctions.editPost_get);

router.post('/itemedit', ensureAdminAuthenticated, administratorController.editPost_post);

router.get("/:pid/itemaddimage", ensureAdminAuthenticated, modFunctions.addImage_get);

router.post('/itemaddimage', ensureAdminAuthenticated, postImageUpload.fields([{name:'coverImage', maxCount: 1}, {name:'mangaImage', maxCount: 1}]), administratorController.addImage_post);

module.exports = router;