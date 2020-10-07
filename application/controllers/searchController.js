const cache = require('../helper/dataCache');
const queue = require('../helper/cacheQueue');
const post = require('./getPostController');

let characterQueue = new queue.cacheQueue(27);
let keywordQueue = new queue.cacheQueue(250);
let typeQueue = new queue.cacheQueue(4);
let originQueue = new queue.cacheQueue(4);
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
            keywordQueue.getCacheById(id).getData(keyword)
                .then((result) => {
                    resultNum.count = result.length;
                    res.render('home', { count: count, post: result, searchCriteria: criteria, resultNum: resultNum });
                }).catch((error) => {
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
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
            characterQueue.getCacheById(firstChar).getData(firstChar)
                .then((result) => {
                    resultNum.count = result.length;
                    res.render('home', { count: count, post: result, resultNum: resultNum });
                }).catch((error) => {
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
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
            typeQueue.getCacheById(type).getData(type)
                .then((result) => {
                    resultNum.count = result.length;
                    res.render('home', { count: count, post: result, resultNum: resultNum });
                }).catch((error) => {
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
}

exports.findByOrigin = (req, res, next) => {
    let origin = req.params.origin;
    let originCache = new cache.cache(post.getByOrigin, origin, 5);
    let resultNum = {};
    resultNum.term = "titles that have the origin: " + origin;
    originQueue.addCache(originCache);
    numCache.getData()
        .then((count) => {
            originQueue.getCacheById(origin).getData(origin)
                .then((result) => {
                    resultNum.count = result.length;
                    res.render('home', { count: count, post: result, resultNum: resultNum });
                }).catch((error) => {
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
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
            tagQueue.getCacheById(tag).getData(tag)
                .then((result) => {
                    resultNum.count = result.length;
                    res.render('home', { count: count, post: result, resultNum: resultNum });
                }).catch((error) => {
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
}

exports.getNewest = (req, res, next) => {
    let newest = {};
    newest.text = "You are seeing the 10 newest posts."
    numCache.getData()
        .then((count) => {
            newestCache.getData()
                .then((result) => {
                    res.render('home', { count: count, post: result, newest: newest });
                }).catch((error) => {
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });
}