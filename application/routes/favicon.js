//Contributors: Osbaldo Martinez
/* This file handles "/banner" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const icon = require('../middlewares/faviconUpdate');
const iconController = require('../controllers/iconController');
const { ensureAdminAuthenticated } = require('../controllers/userAuthenticated');

//POST request to change the icon
router.post('/change', ensureAdminAuthenticated, icon.single("mangaImage"), iconController.updateIcon);

//GET request for the page to change icon
router.get('/change', ensureAdminAuthenticated, iconController.changeIcon);

module.exports = router;