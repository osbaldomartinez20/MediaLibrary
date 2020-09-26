const db = require("../db");

let sql = "INSERT INTO tsftypes (name) VALUES (?)";

let name = ["Other"];

const mysql = require('mysql2');

//fillout the information of your mysql server
const connnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tsfc",
  multipleStatements: true
});

//this this script to create a new database
connnection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  connnection.query(sql, name, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});