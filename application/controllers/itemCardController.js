
const cache = require('../helper/dataCache');
const queue = require('../helper/cacheQueue');
const post = require('./getPostController');

let itemQueue = new queue.cacheQueue(1000);
let numCache = new cache.cache(post.getNumberApproved, "2", 1);

// Show image page on GET
exports.imageCard_get = (req, res, next) => {
    let pid = req.params.pid;
    let itemCache = new cache.cache(post.getPostInfo, pid, 1440);

    itemQueue.addCache(itemCache);

    numCache.getData()
        .then((count) => {
            console.time("h");
            itemQueue.getCacheById(pid).getData(pid)
                .then((result) => {
                    console.timeEnd("h");
                    res.render('imageCard', { count: count, postInfo: result[0], links: result[1], tags: result[2] });
                }).catch((error) => {
                    res.render('error');
                });
        }).catch((error) => {
            res.render('error');
        });

}

exports.imageCardMod_get = (req, res, next) => {
    let pid = req.params.pid;
    let itemCache = new cache.cache(post.getPostInfo, pid, 0.005);

    numCache.getData()
        .then((count) => {
            console.time("h");
            itemCache.getData(pid)
                .then((result) => {
                    console.timeEnd("h");
                    res.render('imageCard', { count: count, postInfo: result[0], links: result[1], tags: result[2] });
                }).catch((error) => {
                    res.render('error');
                });
        }).catch((error) => {
            res.render('error');
        });

}