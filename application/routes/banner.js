//Contributors: Osbaldo Martinez
/* This file handles "/banner" route */
//libraries used for this file
const express = require('express');
const router = express.Router();
const banner = require('../middlewares/bannerUpdate');
const bannerController = require('../controllers/bannerController');
const { ensureAdminAuthenticated } = require('../controllers/userAuthenticated');

//POST request to change the banner
router.post('/change', ensureAdminAuthenticated, banner.single("mangaImage"), bannerController.updateBanner);

//GET request to change banner to default
router.get('/default', ensureAdminAuthenticated, bannerController.defaultBanner);

//GET request for the page to change banner
router.get('/change', ensureAdminAuthenticated, bannerController.changeBanner);

module.exports = router;