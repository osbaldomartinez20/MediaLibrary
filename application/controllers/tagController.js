//Contributors: Osbaldo Martinez
//modules used
const db = require('../config/db');
const fs = require('fs');
const getPostInfo = require('../controllers/getPostController');
const cache = require('../helper/dataCache');

//num cache that has data fpr the number of approved posts
let numCache = new cache.cache(getPostInfo.getNumberApproved, "1", 1);

async function getAllTagsGrouped() {
    let sql = "SELECT tags as \"tag\", COUNT(*) as \"total\" FROM tags INNER JOIN posts USING (pid) WHERE posts.status = 1 GROUP BY tags ORDER BY COUNT(*) DESC;";
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        });
        if (result == undefined) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

let tagCache = new cache.cache(getAllTagsGrouped, "10", 5);

exports.getTagsNumbered = (req, res) => {
    console.log("hello.");
    tagCache.getData()
        .then((tags) => {
            numCache.getData()
            .then((count) => {
                res.render('tags', { count: count, tags: tags });
            }).catch((error) => {
                fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
                req.flash('error', 'There was an internal error.');
                res.redirect('/error');
            });
        }).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
}