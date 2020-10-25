//Contributors: Osbaldo Martinez
//modules used
const db = require('../config/db');
const db2 = require('../config/db2'); //non-promise db
const fs = require('fs');
const getPostInfo = require('../controllers/getPostController');
const { v4: uuidv4 } = require('uuid');
const cache = require('../helper/dataCache');
const comma = require('../helper/addCommas');
const separate = require('../helper/separeteByCommas');

//num cache that has data fpr the number of approved posts
let numCache = new cache.cache(getPostInfo.getNumberApproved, "1", 5);

//gets all the tags grouped by name and ordered by count from more to less
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

//get the tags associated with the post id
async function getPostTags(pid) {
    let sql = "SELECT tags FROM tags WHERE pid = ?";
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, [pid]).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        });
        if (result == undefined) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

//tag cache for the tags
let tagCache = new cache.cache(getAllTagsGrouped, "10", 5);

//uses the getAllTagsGrouped to send them to a page that renders the data
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

//gets the page to add tags to the post with the given post id.
exports.addTags = (req, res) => {
    let post = {}
    post.pid = req.params.pid;
    let tags = {};

    getPostTags(post.pid).
        then((result) => {
            numCache.getData()
                .then((count) => {
                    tags.tag = comma.addCommasTags(result);
                    res.render('addTags', { count: count, tags: tags, post: post });
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

//adds the new tags to the database
exports.updateTags = (req, res) => {
    let { pid, newTags } = req.body;
    let sql = "";
    let placeholders = [];

    let tags = separate.separateTags(newTags);
    let tempId;
    for (let i = 0; i < tags.length; i++) {
        sql += "INSERT INTO tags (tgid, tags, pid) VALUES (?,?,?);";
        tempId = uuidv4();
        placeholders.push(...[tempId, tags[i], pid]);
    }

    db2.query(sql, placeholders, (err, result) => {
        if (err) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        }
        req.flash('success', 'Successfully added new tags. Change will be made public in 30 minutes or less.');
        res.redirect('/libraryitem/' + pid + '/moderator');
    });
}