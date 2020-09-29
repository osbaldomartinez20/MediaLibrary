//Adds types to the type database
const db = require('../db2');

let sql = "INSERT INTO tsftypes (name) VALUES (?)";

let name = ["Other"];

db.query(sql, name, (err, result) => {
  if (err) throw err;
  console.log(result);
});