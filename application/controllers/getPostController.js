//This file retrieves the values in the posts table.
const db = require("../config/db");
const { resolve } = require("path");
const e = require("express");

//retrieves all the information in the tables that have the given post id.
async function getPostInfoById(id) {
    let placeholders = [id, id, id];
    let sql = "SELECT * FROM posts WHERE pid = ? AND status = 0;";

    sql += "SELECT * FROM links WHERE pid = ?;";
    sql += "SELECT * FROM tags WHERE pid = ?";

    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders);
        if (result[0].length < 1) {
            console.log("There was an error getting the post info.");
        }
        resolve(result[0]);
    });
}

//retrieves the number of posts that have been approved.
async function getNumberOfApprovedPosts() {
    let sql = "SELECT COUNT(*) as \"total\" FROM posts WHERE status = 0";
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql);
        if (result[0].length < 1) {
            console.log("There was an error getting the number of posts");
        }
        resolve(result[0]);
    });
}


async function getTenPosts() {
    let sql = "SELECT * FROM posts WHERE status = 0 ORDER BY date DESC LIMIT 10";
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql);
        if (result[0].length < 1) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

//this function gets all the posts that have the specified character first in their tilte.
async function getPostsBasedOnFirstTitleCharacter(firstCharacter) {
    let sql = "";
    let placeholders = [];
    if (firstCharacter == 'no') {
        sql = "SELECT * FROM posts WHERE title NOT RLIKE ? AND status = 0"
        placeholders.push('[a-z]');
    } else {
        sql = "SELECT * FROM posts WHERE title LIKE ? AND status = 0";
        placeholders.push(firstCharacter + '%');
    }
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders);
        if (result[0].length < 1) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

async function getByKeyWord(keyword) {
    let sql = "SELECT * FROM posts WHERE status = 0";
    let placeholders = [];
    if (keyword != "") {
        sql += " AND (title LIKE ? OR description LIKE ?)";
        placeholders = ['%' + keyword + '%', '%' + keyword + '%'];
    }
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders);
        if (result[0].length < 1) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

async function getByType(type) {
    let sql = "SELECT * FROM posts WHERE status = 0 AND type = ?";
    let placeholders = [type];
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders);
        if (result[0].length < 1) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

async function getByTag(tag) {
    let sql = "SELECT tags.pid, posts.title, posts.jtitle, posts.author, posts.description, posts.details, posts.type, posts.cover, posts.image" + 
    " FROM tags INNER JOIN posts USING (pid) WHERE tags = ? AND posts.status = 0";
    let placeholders = [tag];
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders);
        if (result[0].length < 1) {
            console.log("There was an error getting the posts.");
        }
        resolve(result[0]);
    });
}

exports.getPostInfo = getPostInfoById;
exports.getNumberApproved = getNumberOfApprovedPosts;
exports.homePagePosts = getTenPosts;
exports.getByLetter = getPostsBasedOnFirstTitleCharacter;
exports.getByKeyWord = getByKeyWord;
exports.getByType = getByType;
exports.getByTag = getByTag;