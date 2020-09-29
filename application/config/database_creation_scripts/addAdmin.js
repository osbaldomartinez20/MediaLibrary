//Adds an admin to the admin table with the provided information
const db = require('../db2');

let sql = "INSERT INTO admin (aid, username, password) VALUES (?, ?, ?)";

let values = ["000000000000000000000000000000000000", "ADD AN USERNAME FOR YOUR ADMIN", "ADD THE HASH TO YOUR PASSWORD"];


db.query(sql, values, function (err, result) {
    if (err) throw err;
    console.log(result);
});