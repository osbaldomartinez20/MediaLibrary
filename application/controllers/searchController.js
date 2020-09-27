const cache = require('../helper/dataCache');
const queue = require('../helper/cacheQueue');
const post = require('./getPostController');
const db = require("../config/db2");

let characterQueue = new queue.cacheQueue(27);
let numCache = new cache.cache(post.getNumberApproved, "2", 1);

// Handle search redirection on POST
exports.post = (req, res, next) => {
    let keyword = req.body.keyword;
    let sql = "SELECT * FROM posts";
    let placeholders = [];
    let dataPassed = [];
    let criteria = {};

    if (keyword != "") {
        sql += " WHERE (title LIKE ? OR description LIKE ?)";
        placeholders = ['%' + keyword + '%', '%' + keyword + '%'];
        criteria.keyword = keyword;
    }

    db.query(sql, placeholders, (err, result) => {
        if (err) throw err;

        let totalResults = result.length;

        for (let i = 0; i < totalResults; i++) {
            dataPassed.push(result[i]);
        }

        res.render('results', {
            post: dataPassed,
            total: totalResults,
            searchCriteria: criteria
        });
    });
}

exports.firstLetter = (req, res, next) => {
    let firstChar = req.params.character;
    let letterCache = new cache.cache(post.getByLetter, firstChar, 5);
    characterQueue.addCache(letterCache);
    numCache.getData()
        .then((count) => {
            console.time("h");
            characterQueue.getCacheById(firstChar).getData(firstChar)
                .then((result) => {
                    console.log(result);
                    console.timeEnd("h");
                    res.render('home', { count: count, post: result });
                }).catch((error) => {
                    res.sendStatus(503);
                });
        }).catch((error) => {
            res.sendStatus(503);
        });

}