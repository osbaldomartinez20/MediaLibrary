const cache = require('../helper/dataCache');
const queue = require('../helper/cacheQueue');
const post = require('./getPostController');

let characterQueue = new queue.cacheQueue(27);
let keywordQueue = new queue.cacheQueue(250);
let typeQueue = new queue.cacheQueue(4);
let tagQueue = new queue.cacheQueue(150);
let newestCache = new cache.cache(post.homePagePosts, "3", 1);
let numCache = new cache.cache(post.getNumberApproved, "2", 1);

// Handle search redirection on POST
exports.post = (req, res, next) => {
    let keyword = req.body.keyword;
    let id = keyword;
    let criteria = {};
    let resultNum = {};


    if (keyword == "") {
        id = "123456789#0";
        resultNum.term = "titles in total";
    } else {
        criteria.keyword = keyword;
        resultNum.term = "titles that have in their title/description the keyword: " + keyword;
    }

    let keywordCache = new cache.cache(post.getByKeyWord, id, 5);
    keywordQueue.addCache(keywordCache);

    numCache.getData()
        .then((count) => {
            console.time("h");
            keywordQueue.getCacheById(id).getData(keyword)
                .then((result) => {
                    console.timeEnd("h");
                    resultNum.count = result.length;
                    res.render('home', { count: count, post: result, searchCriteria: criteria, resultNum: resultNum });
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
    let resultNum = {};
    resultNum.term = "titles that start with: " + firstChar;
    characterQueue.addCache(letterCache);
    numCache.getData()
        .then((count) => {
            console.time("h");
            characterQueue.getCacheById(firstChar).getData(firstChar)
                .then((result) => {
                    console.timeEnd("h");
                    resultNum.count = result.length;
                    res.render('home', { count: count, post: result, resultNum: resultNum });
                }).catch((error) => {
                    res.render('error');
                });
        }).catch((error) => {
            res.render('error');
        });
}

exports.findByType = (req, res, next) => {
    let type = req.params.type;
    let typeCache = new cache.cache(post.getByType, type, 5);
    let resultNum = {};
    resultNum.term = "titles that have the TSF type: " + type;
    typeQueue.addCache(typeCache);
    numCache.getData()
        .then((count) => {
            console.time("h");
            typeQueue.getCacheById(type).getData(type)
                .then((result) => {
                    console.timeEnd("h");
                    resultNum.count = result.length;
                    res.render('home', { count: count, post: result, resultNum: resultNum });
                }).catch((error) => {
                    res.render('error');
                });
        }).catch((error) => {
            res.render('error');
        });
}

exports.findByTag = (req, res, next) => {
    let tag = req.params.tag;
    let tagCache = new cache.cache(post.getByTag, tag, 5);
    let resultNum = {};
    resultNum.term = "titles that have the tag: " + tag;
    tagQueue.addCache(tagCache);
    numCache.getData()
        .then((count) => {
            console.time("h");
            tagQueue.getCacheById(tag).getData(tag)
                .then((result) => {
                    console.timeEnd("h");
                    resultNum.count = result.length;
                    res.render('home', { count: count, post: result, resultNum: resultNum });
                }).catch((error) => {
                    res.render('error');
                });
        }).catch((error) => {
            res.render('error');
        });
}

exports.getNewest = (req, res, next) => {
    let newest = {};
    newest.text = "You are seeing the 10 newest posts."
    numCache.getData()
        .then((count) => {
            console.time("h");
            newestCache.getData()
                .then((result) => {
                    console.timeEnd("h");
                    res.render('home', { count: count, post: result, newest: newest });
                }).catch((error) => {
                    res.render('error');
                });
        }).catch((error) => {
            res.render('error');
        });
}