//Contributors: Osbaldo Martinez
/* This file handles "/masteradmin" route */
//libraries used for this file
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

//GET request to render settings page for admin
router.get('/settings', ensureAdminAuthenticated, modFunctions.settings);

//POST request to change the admin's password
router.post('/changepass', ensureAdminAuthenticated, administratorController.changePassword);

// GET request for administrator's dashboard page to review mods
router.get('/dashboard', ensureAdminAuthenticated, administratorController.dashboard);

//GET request for admin dashboard to review image posts
router.get('/imagereview', ensureAdminAuthenticated, modFunctions.dashboard);

// GET request for approving moderator
router.get('/:mid/approve', ensureAdminAuthenticated, administratorController.approve);

// GET request for disapproving moderator
router.get('/:mid/disapprove', ensureAdminAuthenticated, administratorController.disapprove);

// GET request for removing moderator
router.get('/:mid/remove', ensureAdminAuthenticated, administratorController.remove);

//GET request to approve post
router.get('/:pid/itemapprove', ensureAdminAuthenticated, administratorController.itemApproval);

//GET request to approve post
router.get('/:pid/itemdisapprove', ensureAdminAuthenticated, administratorController.itemDisapproval);

//GET request to render confirmation of deletion page.
router.get('/:pid/itemconfirmdel', ensureAdminAuthenticated, modFunctions.confrimDelete);

//GET request to delete a post
router.get('/:pid/itemdelete', ensureAdminAuthenticated, administratorController.itemDeletion);

//GET request to get page that can edit post info.
router.get('/:pid/itemedit', ensureAdminAuthenticated, modFunctions.editPost_get);

//POST request to edit post in database
router.post('/itemedit', ensureAdminAuthenticated, administratorController.editPost_post);

//GET request for page to change post images
router.get("/:pid/itemaddimage", ensureAdminAuthenticated, modFunctions.addImage_get);

//POST request that updates image info of the the post in the database
router.post('/itemaddimage', ensureAdminAuthenticated, postImageUpload.fields([{name:'coverImage', maxCount: 1}, {name:'mangaImage', maxCount: 1}]), administratorController.addImage_post);

//POST request that adds a new TSF type to the database
router.post('/newtype', ensureAdminAuthenticated, administratorController.addNewType);

//POST request that adds a new origin to the database
router.post('/neworigin', ensureAdminAuthenticated, administratorController.addNewOrigin);

//GET request to backup all the tables in the database except admin and mod
router.get('/dbbackup', ensureAdminAuthenticated, administratorController.backupDB);


module.exports = router;