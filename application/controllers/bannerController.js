//This file helps with the banner changing functions
const fs = require('fs');
const getPostInfo = require('../controllers/getPostController');
const cache = require('../helper/dataCache');

//num cache that has data fpr the number of approved posts
let numCache = new cache.cache(getPostInfo.getNumberApproved, "1", 1);

//changes the site banner to the default one.
//deletes current banner. 
exports.defaultBanner = (req, res) => {
    fs.readFile('./public/images/main/banner_default.png', (err, data) => {
        if (err) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            req.flash("Error", "Cannot change banner to default.");
            res.redirect('/masteradmin/settings');
        }
        fs.unlinkSync('./public/images/main/banner_site.png');
        fs.writeFileSync('./public/images/main/banner_site.png', data);

        req.flash("success", "Successfully changed site banner to default");
        res.redirect('/masteradmin/settings');
    });
}

//renders page of the form to change the banner image
exports.changeBanner = (req, res) => {
    numCache.getData()
        .then((count) => {
            res.render('changeBanner', { count: count });
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash("Error", "Cannot change banner to default.");
            res.redirect('/masteradmin/settings');
        });
}