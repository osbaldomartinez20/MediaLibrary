const cache = require('../helper/dataCache');
const queue = require('../helper/cacheQueue');
const post = require('./getPostController');

let characterQueue = new queue.cacheQueue(27);
let keywordQueue = new queue.cacheQueue(250);
let typeQueue = new queue.cacheQueue(4);
let tagQueue = new queue.cacheQueue(150);
let numCache = new cache.cache(post.getNumberApproved, "2", 1);

// Handle search redirection on POST
exports.post = (req, res, next) => {
    let keyword = req.body.keyword;
    let id = keyword;
    let criteria = {};
    

    if (keyword == "") {
        id = "123456789#0";
    } else {
        criteria.keyword = keyword;
    }

    let keywordCache = new cache.cache(post.getByKeyWord, id, 5);
    keywordQueue.addCache(keywordCache);

    numCache.getData()
        .then((count) => {
            console.time("h");
            keywordQueue.getCacheById(id).getData(keyword)
                .then((result) => {
                    console.timeEnd("h");
                    res.render('home', { count: count, post: result, searchCriteria: criteria });
                }).catch((error) => {
                    res.render('error');
                });
        }).catch((error) => {
            res.render('error');
        });
}

exports.findByFirstLetter = (req, res, next) => {
    let firstChar = req.params.character;
    let letterCache = new cache.cache(post.getByLetter, firstChar, 5);
    characterQueue.addCache(letterCache);
    numCache.getData()
        .then((count) => {
            console.time("h");
            characterQueue.getCacheById(firstChar).getData(firstChar)
                .then((result) => {
                    console.timeEnd("h");
                    res.render('home', { count: count, post: result });
                }).catch((error) => {
                    res.render('error');
                });
        }).catch((error) => {
            res.render('error');
        });
}

exports.findByType = (req, res, next) => {
    let type = req.params.type;
    let typeCache = new cache.cache(post.getByType, type, 1440);
    typeQueue.addCache(typeCache);
    numCache.getData()
        .then((count) => {
            console.time("h");
            typeQueue.getCacheById(type).getData(type)
                .then((result) => {
                    console.timeEnd("h");
                    res.render('home', { count: count, post: result });
                }).catch((error) => {
                    res.render('error');;
                });
        }).catch((error) => {
            res.render('error');
        });
}

exports.findByTag = (req, res, next) => {
    let tag = req.params.tag;
    let tagCache = new cache.cache(post.getByTag, tag, 5);
    tagQueue.addCache(tagCache);
    numCache.getData()
        .then((count) => {
            console.time("h");
            tagQueue.getCacheById(tag).getData(tag)
                .then((result) => {
                    console.timeEnd("h");
                    res.render('home', { count: count, post: result });
                }).catch((error) => {
                    res.render('error');;
                });
        }).catch((error) => {
            res.render('error');
        });
}