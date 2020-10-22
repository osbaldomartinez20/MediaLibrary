//Contributors: Osbaldo Martinez
//This file retrieves the values in the posts table.
const db = require("../config/db");
const fs = require('fs');

//retrieves all the information in the tables that have the given post id.
async function getPostInfoById(id) {
    let placeholders = [id, id, id];
    let sql = "SELECT * FROM posts WHERE pid = ?;";

    sql += "SELECT * FROM links WHERE pid = ?;";
    sql += "SELECT * FROM tags WHERE pid = ?;";

    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        });
        if (result == undefined) {
            console.log("There was an error getting the post info.");
        }
        resolve(result[0]);
    });
}

//gets the pid, cover, image of the post with the given id.
async function getPostImagesById(id) {
    let placeholders = [id];
    let sql = "SELECT pid, cover, image FROM posts WHERE pid = ?;";

    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        });
        if (result == undefined) {
            console.log("There was an error getting the post info.");
        }
        resolve(result[0]);
    });
}

//retrieves the number of posts that have been approved.
async function getNumberOfApprovedPosts() {
    let sql = "SELECT COUNT(*) as \"total\" FROM posts WHERE status = 1;";
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        });
        if (result == undefined) {
            console.log("There was an error getting the number of posts");
        }
        resolve(result[0]);
    });
}

//retrieves the 10 newest approved posts
async function getTenPosts() {
    let sql = "SELECT * FROM posts WHERE status = 1 ORDER BY date DESC LIMIT 10;";
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

//this function gets all the posts that have the specified character first in their tilte.
async function getPostsBasedOnFirstTitleCharacter(firstCharacter) {
    let sql = "";
    let placeholders = [];
    if (firstCharacter == 'symbols') {
        sql = "SELECT * FROM posts WHERE title NOT RLIKE ? AND status = 1;"
        placeholders.push('[a-z]');
    } else {
        sql = "SELECT * FROM posts WHERE title LIKE ? AND status = 1;";
        placeholders.push(firstCharacter + '%');
    }
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        });
        if (result == undefined) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

//retrieves the posts that match the given keyword in their titles or description
async function getByKeyWord(keyword) {
    let sql = "SELECT * FROM posts WHERE status = 1";
    let placeholders = [];
    //check to see if keyword is not empty to add conditions to the query.
    if (keyword != "") {
        sql += " AND (title LIKE ? OR description LIKE ?)";
        placeholders = ['%' + keyword + '%', '%' + keyword + '%'];
    }
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        });
        if (result == undefined) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

//retrieves the posts that have the given type.
async function getByType(type) {
    let sql = "SELECT * FROM posts WHERE status = 1 AND type = ?;";
    let placeholders = [type];
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        });
        if (result == undefined) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

//retrieves the posts that have the given origin.
async function getByOrigin(origin) {
    let sql = "SELECT * FROM posts WHERE status = 1 AND origin = ?;";
    let placeholders = [origin];
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        });
        if (result == undefined) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

//retrieves the posts that have the given tag.
async function getByTag(tag) {
    let sql = "SELECT tags.pid, posts.title, posts.jtitle, posts.author, posts.description, posts.details, posts.type, posts.cover, posts.image" +
        " FROM tags INNER JOIN posts USING (pid) WHERE tags = ? AND posts.status = 1;";
    let placeholders = [tag];
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders).catch((error) => {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', error + '');
        });
        if (result == undefined) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

async function getAllPosts() {
    let sql = "SELECT * FROM posts ORDER BY date DESC;";
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

//exports of the functions
exports.getPostInfo = getPostInfoById;
exports.getPostImagesById = getPostImagesById;
exports.getNumberApproved = getNumberOfApprovedPosts;
exports.homePagePosts = getTenPosts;
exports.getAll = getAllPosts;
exports.getByLetter = getPostsBasedOnFirstTitleCharacter;
exports.getByKeyWord = getByKeyWord;
exports.getByType = getByType;
exports.getByOrigin = getByOrigin;
exports.getByTag = getByTag;