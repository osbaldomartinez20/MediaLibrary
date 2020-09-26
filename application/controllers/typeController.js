//This file retrieves the values in the types table.
const db = require("../config/db");
const { resolve } = require("path");

async function getTypes() {
    let sql = "SELECT name FROM tsftypes";
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql);
        if (result[0].length < 1) {
            console.log("There was an error getting the types");
        }
        resolve(result[0]);
    });
}

exports.retrieve = getTypes;