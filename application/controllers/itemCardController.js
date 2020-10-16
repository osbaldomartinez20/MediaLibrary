//Contributors: Osbaldo Martinez
const cache = require('../helper/dataCache');
const queue = require('../helper/cacheQueue');
const post = require('./getPostController');

//item queue of 1000 to store the information of posts.
let itemQueue = new queue.cacheQueue(1000);
//cache that gives the num of approved posts
let numCache = new cache.cache(post.getNumberApproved, "2", 1);

// Show image page on GET for the post of the given post id in the parameters
exports.imageCard_get = (req, res, next) => {
    let pid = req.params.pid;
    //cache time to live is in minutes so 1440 min = 1 day.
    //cache is 1 day long because the info will rarely change.
    let itemCache = new cache.cache(post.getPostInfo, pid, 1440);

    itemQueue.addCache(itemCache);

    numCache.getData()
        .then((count) => {
            itemQueue.getCacheById(pid).getData(pid)
                .then((result) => {
                    res.render('imageCard', { count: count, postInfo: result[0], links: result[1], tags: result[2] });
                }).catch((error) => {
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });

}

// Show image page on GET for the post of the given post id in the parameters
//cache is basically non-existent becuase this will show the changes made by mods
//as soon as they are made.
exports.imageCardMod_get = (req, res, next) => {
    let pid = req.params.pid;
    let itemCache = new cache.cache(post.getPostInfo, pid, 0.005);

    numCache.getData()
        .then((count) => {
            itemCache.getData(pid)
                .then((result) => {
                    res.render('imageCard', { count: count, postInfo: result[0], links: result[1], tags: result[2] });
                }).catch((error) => {
                    req.flash('error', 'There was an internal error.');
                    res.redirect('/error');
                });
        }).catch((error) => {
            req.flash('error', 'There was an internal error.');
            res.redirect('/error');
        });

}