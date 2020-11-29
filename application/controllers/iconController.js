//Contributors: Osbaldo Martinez
//This file helps with the icon changing functions
const fs = require('fs');
const getPostInfo = require('../controllers/getPostController');
const cache = require('../helper/dataCache');

//num cache that has data fpr the number of approved posts
let numCache = new cache.cache(getPostInfo.getNumberApproved, "1", 1);

//renders page of the form to change the icon image
exports.changeIcon = (req, res) => {
    numCache.getData()
        .then((count) => {
            res.render('changeFavicon', { count: count });
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash("Error", "Cannot retrieve icon change form.");
            res.redirect('/masteradmin/settings');
        });
}

//makes sure that the updating of the icon was successful
exports.updateIcon = (req, res, next) => {
    if (req.file) {
        req.flash("success", "Successfully changed site icon. Reload to see change.");
        res.redirect('/masteradmin/settings');
    } else {
        req.flash("error", "Error only .ico images accepted.");
        res.redirect('/masteradmin/settings');
    }
}