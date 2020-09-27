const fs = require('fs');
const cache = require('../helper/dataCache');
const queue = require('../helper/cacheQueue');
const post = require('./getPostController');

let itemQueue = new queue.cacheQueue(1000);
let numCache = new cache.cache(post.getNumberApproved, "2", 1);

// Show image page on GET
exports.imageCard_get = (req, res, next) => {
    let pid = req.params.pid;
    let itemCache = new cache.cache(post.getPostInfo, pid, 1440);
    let postInfo = [];
    let linkList = [];
    let tagList = [];

    itemQueue.addCache(itemCache);

    numCache.getData()
        .then((count) => {
            console.time("h");
            itemQueue.getCacheById(pid).getData(pid)
                .then((result) => {
                    console.timeEnd("h");
                    postInfo = result[0];
                    linkList = result[1];
                    tagList = result[2];
                    res.render('imageCard', { count: count, postInfo: postInfo, links: linkList, tags: tagList });
                }).catch((error) => {
                    res.render('error');
                });
        }).catch((error) => {
            res.render('error');
        });

}

// Show image page for revising image on GET
exports.edit_get = (req, res, next) => {
    let pid = req.params.pid;
    let user = req.user.id;

    let dataPassed = [];

    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) throw error;

        if (user != result[0].userid) {
            req.flash('error', 'Not the owner of the post.');
            res.redirect('/user/dashboard');
        }
        dataPassed = result[0];

        res.render('editImage', {
            values: dataPassed
        });
    });
}

//submits edits to the tilte and description
exports.edit_post = (req, res, next) => {
    let { title, description } = req.body;
    let pid = req.params.pid;
    let user = req.user.id;

    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) throw error;

        if (user != result[0].userid) {
            req.flash('error', 'Not the owner of the post.');
            res.redirect('/user/dashboard');
        }

        sql = "UPDATE posts SET title = ?, description = ? WHERE pid = ?";
        db.query(sql, [title, description, pid], (error2, result2) => {
            if (error2) throw error2;

            req.flash('success', 'Updated Post Information.');
            res.redirect('/user/dashboard');
        });
    });
}

exports.confirm_get = (req, res, next) => {
    let pid = req.params.pid;
    let user = req.user.id;
    let dataPassed = [];

    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) throw error;

        if (user != result[0].userid) {
            req.flash('error', 'Not the owner of the post.');
            res.redirect('/user/dashboard');
        }

        dataPassed = result[0];
        res.render('deleteConfirm', {
            values: dataPassed
        });

    });
}

exports.delete_get = (req, res, next) => {
    let pid = req.params.pid;
    let user = req.user.id;

    let sql = "SELECT * FROM posts WHERE pid = ?";

    db.query(sql, [pid], (error, result) => {
        if (error) throw error;

        if (user != result[0].userid) {
            req.flash('error', 'Not the owner of the post.');
            res.redirect('/user/dashboard');
        }

        sql = "DELETE FROM posts WHERE pid = ?";
        let imageN = result[0].filename;

        db.query(sql, [pid], (error2, result2) => {
            if (error2) throw error2;

            fs.unlink('./public/images/uploads/' + user + '/postImages/' + imageN, (err) => {
                if (err) throw err;
                console.log('successfully deleted file.');
                
                req.flash('success', 'Deleted Post Information.');
                res.redirect('/user/dashboard');

            });
        });
    });
}