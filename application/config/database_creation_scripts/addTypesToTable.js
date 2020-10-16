//Contributors: Osbaldo Martinez
//This file adds the starting values for the tsftypes table.
const db = require('../db2');

let sql = "INSERT INTO tsftypes (name) VALUES (?);INSERT INTO tsftypes (name) VALUES (?);INSERT INTO tsftypes (name) VALUES (?);INSERT INTO tsftypes (name) VALUES (?)";

let names = ["Bodyswap","Possession", "Transformation","Other"];

db.query(sql, names, (err, result) => {
  if (err) throw err;
  console.log(result);
});