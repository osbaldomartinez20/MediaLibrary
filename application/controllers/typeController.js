const { resolve } = require("path");
//This file retrieves the values in the types table.
const db = require("../config/db");
const cache = require("./cacheController");
let types = []; //declare an empty list to hold the categories


let sql = "SELECT * FROM tsftypes";

async function getTypes() {
    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql);
        if (result[0].length < 1) {
            console.log("There was an error getting the types");
        }
        resolve(result[0]);
    });
}

exports.retrieve = getTypes;