//Contributors: Osbaldo Martinez
//This file retrieves the values in the tsftypes and origin table.
const db = require("../config/db");

//get all the types from the tsftypes
async function getTypes() {
    let sql = "SELECT * FROM tsftypes ORDER BY tid;";

    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql);
        if (result[0].length < 1) {
            console.log("There was an error getting the types");
        }
        resolve(result[0]);
    });
}

//get all the origins from the origin
async function getOrigins() {
    let sql = "SELECT * FROM origin ORDER BY oid;";

    return new Promise(async function (resolve, reject) {
        const result = await db.query(sql);
        if (result[0].length < 1) {
            console.log("There was an error getting the types");
        }
        resolve(result[0]);
    });
}

//exports the functions
exports.retrieve = getTypes;
exports.originGet = getOrigins;