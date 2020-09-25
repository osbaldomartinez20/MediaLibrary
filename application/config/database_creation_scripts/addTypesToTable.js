const db = require("../db");

let sql = "INSERT INTO tsftypes (name) VALUES (?)";

let name = ["Transformation"];

db.query(sql, name, (err, result) => {
    if (err) {
        console.log(err);
    }

    console.log(result);
});