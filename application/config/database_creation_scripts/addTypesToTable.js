//Adds types to the type database
const db = require('../db2');

let sql = "INSERT INTO tsftypes (name) VALUES (?);INSERT INTO tsftypes (name) VALUES (?);INSERT INTO tsftypes (name) VALUES (?);INSERT INTO tsftypes (name) VALUES (?)";

let names = ["Bodyswap","Possession", "Transformation","Other"];

db.query(sql, names, (err, result) => {
  if (err) throw err;
  console.log(result);
});