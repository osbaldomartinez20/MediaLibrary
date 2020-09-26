//This file retrieves the values in the posts table.
const db = require("../config/db");
const { resolve } = require("path");

//retrieves all the information in the tables that have the given post id.
async function getPostInfoById(id) {
    let placeholders = [id, id, id];
    let sql = "SELECT * FROM posts WHERE pid = ?;";
    
    sql += "SELECT * FROM links WHERE pid = ?;";
    sql += "SELECT * FROM tags WHERE pid = ?";

    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql, placeholders);
        if (result[0].length < 1) {
            console.log("There was an error getting the types");
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
            console.log("There was an error getting the types");
        }
        resolve(result[0][0]);
    });
}

exports.getPostInfo = getPostInfoById;
exports.getNumberApproved = getNumberOfApprovedPosts;