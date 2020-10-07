const db = require('../db2');

let sql = "INSERT INTO origin (name) VALUES (?);INSERT INTO origin (name) VALUES (?);INSERT INTO origin (name) VALUES (?);INSERT INTO origin (name) VALUES (?);";
let names = ["Manga", "Doujinshi", "Western", "Other"];

db.query(sql, names, (err, result) => {
    if (err) throw err;
    console.log(result);
});